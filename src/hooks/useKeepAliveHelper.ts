import { emitter } from '@/plugins';
import { nextTick, ref } from 'vue';
import {
  onBeforeRouteUpdate,
  type RouteComponent,
  type RouteLocationNamedRaw,
  type RouteLocationNormalizedLoaded,
  useRouter,
} from 'vue-router';

const addRouteCompKeepAliveEvt = Symbol('添加路由对应的vue组件的keep-alive缓存事件');
const removeRouteCompKeepAliveEvt = Symbol('删除路由对应vue组件的keep-alive缓存事件');
const refreshCurRouteEvt = Symbol('刷新当前路由事件');

export interface RouteNameCompName {
  /**
   * 路由的name属性值
   */
  routeName: string;
  /**
   * 组件的name属性值
   */
  compName: string;
  /**
   * 默认是否需要将 compName 对应的组件, 使用 keepAlive 进行缓存
   */
  keepAlive: boolean;
}

/**
 * key为路由的name属性值
 */
const routeNameCompNameMap = new Map<string, RouteNameCompName>();

/**
 * 从路由组件中获取真实的组件名
 *
 * 暂时发现 RouteComponent 有两种情况：
 * 一. RouteComponent 就是一个 vue 的 Component, 此时又分为两种情况：
 *      1. vue组件未定义组件name：那么vue会自动根据文件名生成组件名，并放入 `__name` 属性
 *      2. vue组件定义了组件name: 那么此时要取 name 值，则直接访问 name 属性即可
 * 二. RouteComponent 是一个函数。此时的路由引入方式为: `component: () => import('@/pages/Home.vue')`
 *     要获取到这个函数表示组件的组件名，需要先执行这个函数，执行这个函数会返回一个Promise值，Promise的内容
 *     就是组件对象，这个组件对象的name获取也像上面一的情况一样，需要分为两种情况获取
 *
 * @param   {RouteComponent<string>}  routeComp  路由组件
 *
 * @return  {Promise<string>}                    组件名
 */
async function getCompName(routeComp: RouteComponent): Promise<string> {
  let tmp = routeComp;
  if (tmp instanceof Function) {
    // @ts-ignore
    tmp = await routeComp();
    // @ts-ignore
    return tmp.default.name || tmp.default.__name;
  } else {
    // @ts-ignore
    return tmp.name || tmp.__name;
  }
}
/**
 * 从路由信息中获取路由名，组件名以及组件是否需要缓存
 *
 * @param route 路由信息
 */
async function findRouteNameCompName(route: RouteLocationNormalizedLoaded): Promise<RouteNameCompName | undefined> {
  let ret: RouteNameCompName | undefined = undefined;
  const currentRoute = route;
  const curRouteName = currentRoute.name;
  if (!curRouteName) {
    return ret;
  }
  ret = routeNameCompNameMap.get(curRouteName as string);
  if (ret) {
    return ret;
  }
  const { keepAlive = true } = currentRoute.meta;
  const matchedRouteArr = currentRoute.matched;
  for (const routeInfo of matchedRouteArr) {
    if (routeInfo.name === curRouteName) {
      /*
        important: 当SFC的组件定义中有使用name属性指定组件名时, routeInfo.components?.default?.name 可以取到值
        important: 当SFC的组件定义中没使用name属性指定组件名时, routeInfo.components?.default?.name 取不到值，vue 3.2.34 或以上的版本会自动根据文件名生成对应的name，但该name在__name上
         */
      if (!routeInfo.components || !routeInfo.components.default) {
        return ret;
      }
      const compName = await getCompName(routeInfo.components.default);
      return {
        compName,
        routeName: curRouteName as string,
        keepAlive: keepAlive as boolean,
      };
    }
  }
}

const CLEAR_KEEP_ALIVE_PARAM_NAME = '__clearKeepAlive';

/**
 * 如果route的query参数包含 __clearKeepAlive 的参数且为true，则获取到该路由对应的组件名
 *
 * @return  {[type]}  [return description]
 */
async function getRouteNameCompNameIfNeedClearKeepAlive(route: RouteLocationNormalizedLoaded) {
  if (route.query[CLEAR_KEEP_ALIVE_PARAM_NAME] === 'true' && route.name) {
    return await findRouteNameCompName(route);
  }
}

/**
 * 智能添加 keep-alive 缓存
 *
 * @param   {RouteNameCompName}  _data  需要智能添加缓存的路由名以及组件名
 *
 */
export function addCompKeepAliveByEvt(_data: RouteNameCompName) {
  emitter.emit(addRouteCompKeepAliveEvt, _data);
}
/**
 * 刷新当前路由
 */
export function refreshCurRouteByEvt() {
  emitter.emit(refreshCurRouteEvt);
}
/**
 * 智能添加 keep-alive 缓存(通过事件方式实现)
 * @param   {RouteLocationNormalizedLoaded}  route  需要智能添加缓存的路由信息
 */
export async function aiAddRouteKeepAliveByEvt(route: RouteLocationNormalizedLoaded) {
  const _data = await findRouteNameCompName(route);
  if (_data) {
    emitter.emit(addRouteCompKeepAliveEvt, _data);
  }
}

/**
 * 智能删除keep-alive缓存
 *
 * @param   {RouteLocationNormalizedLoaded}  route  需要智能删除keep-alive缓存的路由信息
 *
 * @return  {[type]}                             [return description]
 */
export async function aiRemoveRouteKeepAliveByEvt(route: RouteLocationNormalizedLoaded) {
  const compNameArr: string[] = [];
  const routeNameCompName = await getRouteNameCompNameIfNeedClearKeepAlive(route);
  if (routeNameCompName) {
    compNameArr.push(routeNameCompName.compName);
  }
  if (compNameArr.length > 0) {
    return new Promise<void>((resolve) => {
      const params: RemoveRouteCompKeepAliveEvtParam = {
        compNameArr,
        resolve,
      };
      emitter.emit(removeRouteCompKeepAliveEvt, params);
    });
  }
  return Promise.resolve();
}

/**
 * 智能判断是让keep-alive组件缓存路由对应的vue组件还是清除路由对应的vue组件，并通过事件方式实现
 */
export async function aiAddOrRemoveRouteKeepAliveByEvt(route: RouteLocationNormalizedLoaded) {
  await aiAddRouteKeepAliveByEvt(route);
  await aiRemoveRouteKeepAliveByEvt(route);
}
/**
 * 删除组件的keep-alive缓存
 *
 * @param   {string[]}  compNameArr  需要清除keep-alive缓存的组件名数组
 *
 */
export function removeCompArrKeepAliveByEvt(compNameArr: string[]) {
  if (compNameArr.length > 0) {
    return new Promise<void>((resolve) => {
      const params: RemoveRouteCompKeepAliveEvtParam = {
        compNameArr,
        resolve,
      };
      emitter.emit(removeRouteCompKeepAliveEvt, params);
    });
  }
  return Promise.resolve();
}
interface RemoveRouteCompKeepAliveEvtParam {
  compNameArr: string[];
  resolve: () => void;
}
/**
 * 删除路由的keep-alive缓存
 *
 * @param   {string[]}  routeNameArr  需要清除keep-alive缓存的路由名数组
 *
 */
export function removeRouteArrKeepAliveByEvt(routeNameArr: string[]) {
  if (routeNameArr.length > 0) {
    const compNameArr: string[] = [];
    routeNameArr.forEach((routeName) => {
      const compNameAndRouteName = routeNameCompNameMap.get(routeName);
      if (compNameAndRouteName) {
        compNameArr.push(compNameAndRouteName.compName);
      } else {
        // console.warn(`当前缓存的路由名中，未找到[${routeName}]路由对应的组件名`);
      }
    });

    return new Promise<void>((resolve) => {
      const params: RemoveRouteCompKeepAliveEvtParam = {
        compNameArr,
        resolve,
      };
      emitter.emit(removeRouteCompKeepAliveEvt, params);
    });
  }
  return Promise.resolve();
}
/**
 * 删除路由的keep-alive缓存
 *
 * @param   {string}  routeName  需要清除keep-alive缓存的路由名
 */
export function removeRouteKeepAliveByEvt(routeName: string) {
  return removeRouteArrKeepAliveByEvt([routeName]);
}
/**
 * 删除组件的keep-alive缓存
 *
 * @param   {string}  compName  需要清除keep-alive缓存的组件名
 *
 */
export function removeCompKeepAlive(compName: string) {
  return new Promise<void>((resolve) => {
    const params: RemoveRouteCompKeepAliveEvtParam = {
      compNameArr: [compName],
      resolve,
    };
    emitter.emit(removeRouteCompKeepAliveEvt, params);
  });
}

export function useKeepAliveRoute() {
  const $router = useRouter();
  /**
   * 通过push方式转入路由，且禁止路由使用keep-alive的缓存(调用该方法必须设置name值)
   *
   * 内部实际调用的 removeOneRouteKeepAliveAndToOtherRoute 方法
   *
   * @param   {RouteLocationRaw}  routeLocation  需要转入的路由
   */
  function pushAndDisableKeepAlive(routeLocation: RouteLocationNamedRaw) {
    if (!routeLocation.name) {
      throw new Error('调用 pushAndDisableKeepAlive 方法， routeLocation 参数必须指定 name 值');
    }
    return removeOneRouteKeepAliveAndToOtherRoute(routeLocation.name as string, routeLocation);
  }
  /**
   * 清除指定路由的keep-alive缓存，然后转入一个新路由
   *
   * @param clearKeepAliveRouteName 需要清除keep-alive缓存的路由名
   * @param to 需要通过push方式跳转的路由
   */
  function removeOneRouteKeepAliveAndToOtherRoute(clearKeepAliveRouteName: string, to: any) {
    return removeRouteArrKeepAliveByEvt([clearKeepAliveRouteName]).then(() => {
      return $router.push(to);
    });
  }

  return { pushAndDisableKeepAlive, removeOneRouteKeepAliveAndToOtherRoute };
}

/**
 * 获取KeepAliveWrapper组件的include数据
 */
export function useKeepAliveWrapperIncludeData() {
  const include = ref<string[]>([]);
  const curRouteName = ref<string>();
  /**
   * 根据 routeNameCompName 更新 include 值
   *
   * @return  {[type]}  [return description]
   */
  function updateIncludeByRouteNameCompName(routeNameCompName: RouteNameCompName) {
    // 缓存路由名和组件名的映射关系
    routeNameCompNameMap.set(routeNameCompName.routeName, routeNameCompName);
    const idx = include.value.findIndex((item) => item === routeNameCompName.compName);
    if (routeNameCompName.keepAlive) {
      // 需要添加缓存
      if (idx < 0) {
        include.value.push(routeNameCompName.compName);
      }
    } else {
      // 无需添加缓存
      if (idx >= 0) {
        include.value.splice(idx, 1);
      }
    }
  }
  /**
   * 智能添加 keep-alive 缓存
   * @param   {RouteLocationNormalizedLoaded}  route  需要智能添加缓存的路由信息
   */
  async function aiAddRouteKeepAlive(route: RouteLocationNormalizedLoaded) {
    const _data = await findRouteNameCompName(route);
    if (_data) {
      updateIncludeByRouteNameCompName(_data);
    }
  }
  /**
   * 智能删除keep-alive缓存. 如果 route 的 query 参数包含 __clearKeepAlive 参数且值为 true，则会清除 route 的 keep-alive 缓存
   *
   * @param   {RouteLocationNormalizedLoaded}  route  需要智能删除keep-alive缓存的路由信息
   *
   * @return  {[type]}                             [return description]
   */
  async function aiRemoveRouteKeepAlive(route: RouteLocationNormalizedLoaded) {
    const compNameArr: string[] = [];
    const routeNameCompName = await getRouteNameCompNameIfNeedClearKeepAlive(route);
    if (routeNameCompName) {
      compNameArr.push(routeNameCompName.compName);
    }
    updateIncludeByCompNameArr(compNameArr);
    if (routeNameCompName) {
      // 等待vue将上面的微任务执行完毕(上面的微任务包含一些什么？1.index属性值的更新 2.界面的重新渲染)
      await nextTick();
      // 执行到这里vue已经将界面重新渲染完毕(keep-alive中的缓存已经更新)。再根据组件的初始keepAlive状态，决定是否需要再将当前的组件名放入keep-alive的include数组中
      updateIncludeByRouteNameCompName(routeNameCompName);
    }
  }
  /**
   * 智能判断是让keep-alive组件缓存路由对应的vue组件还是清除路由对应的vue组件
   */
  async function aiAddOrRemoveRouteKeepAlive(route: RouteLocationNormalizedLoaded) {
    await aiAddRouteKeepAlive(route);
    await aiRemoveRouteKeepAlive(route);
  }
  /**
   * 通过 compNameArr 删除 include 中的值
   *
   * @param   {string[]}  compNameArr  待删除的组件名
   */
  function updateIncludeByCompNameArr(compNameArr: string[]) {
    if (compNameArr && compNameArr.length > 0) {
      compNameArr.forEach((compName) => {
        // 找到然后删除
        const idx = include.value.findIndex((item) => item === compName);
        if (idx >= 0) {
          include.value.splice(idx, 1);
        }
      });
    }
  }

  // watch函数监听路由
  // const route = useRoute();
  // watch(
  //   () => route.path,
  //   async () => {
  //     curRouteName.value = route.name as string;
  //     await aiAddOrRemoveRouteKeepAlive(route);
  //   },
  // );

  onBeforeRouteUpdate(async (to) => {
    if (to.name) {
      curRouteName.value = to.name as string;
    }
    await aiAddOrRemoveRouteKeepAlive(to);
  });

  /**
   * 监听添加keep-alive缓存的事件
   *
   * @param   {unknown}  _data                     需要添加keep-alive缓存的组件名和路由名
   */
  emitter.on(addRouteCompKeepAliveEvt, (_data: unknown) => {
    const routeNameCompName = _data as RouteNameCompName;
    updateIncludeByRouteNameCompName(routeNameCompName);
  });
  /**
   * 监听组件 keep-alive 缓存删除事件
   *
   * @param   {unknown}  _data                        需要删除 keep-alive 缓存的组件名数组
   *
   * @return  {[type]}                                [return description]
   */
  emitter.on(removeRouteCompKeepAliveEvt, (_data: unknown) => {
    const { compNameArr, resolve } = _data as RemoveRouteCompKeepAliveEvtParam;
    updateIncludeByCompNameArr(compNameArr);
    resolve();
  });

  const showRouterView = ref<boolean>(true);
  emitter.on(refreshCurRouteEvt, () => {
    // 这里实际是让组件销毁
    showRouterView.value = false;
    if (curRouteName.value) {
      // 通过路由名找到组件名
      const compNameAndRouteName = routeNameCompNameMap.get(curRouteName.value);
      if (compNameAndRouteName) {
        // 找到include中的组件名
        const idx = include.value.findIndex((compName) => compName === compNameAndRouteName.compName);
        if (idx >= 0) {
          // 删除这个组件名
          include.value.splice(idx, 1);
        }
      }
    }
    nextTick(() => {
      showRouterView.value = true;
      const compNameAndRouteName = curRouteName.value && routeNameCompNameMap.get(curRouteName.value);
      if (compNameAndRouteName && compNameAndRouteName.keepAlive) {
        // 如果原本这个组件就是支持缓存的，则继续让它支持缓存
        include.value.push(compNameAndRouteName.compName);
      }
    });
  });
  return { include, showRouterView };
}
