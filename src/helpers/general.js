export function initialize(store, router, axios) {
    router.beforeEach((to, from, next) => {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        const token = store.state.auth.token;
    
        if(token){
            Echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${store.state.auth.token}`
        }

        if(token){
            axios.defaults.headers.common["Authorization"] = `Bearer ${store.state.auth.token}` 
        }

        if (requiresAuth && !token) {
            next('/');
        } else if (to.path == '/' && token) {
                next('/dashboard');
        }
         else {
            next();
        }

        // switch( to.meta.permission ){

        //     case 'denied':
        //      if( !currentUser ){
        //         next();
        //       }else{
        //         next('/home');
        //       }
        //     break;

        //     case 'volunteer':
        //      if( store.getters.currentUser.permission == 0 ){
        //         next();
        //       }else{
        //         next('/home');
        //       }
        //     break;

        //     case 'organizer':
        //       if( store.getters.currentUser.permission == 1 ){
        //         next();
        //       }else{
        //         next('/home');
        //       }
        //     break;

        //     case 'admin':
        //     if( store.getters.currentUser.permission == 2 ){
        //       next();
        //     }else{
        //       next('/home');
        //     }
        //   break;

        // }


    })


    // router.beforeEach((to, from, next) => {

    //     if(to.path){
    //         NProgress.start()
    //     }
    //     next()
    
    // });
    
    // router.afterEach(() => {
    
    //     NProgress.done()
    
    // });

    axios.interceptors.response.use(null, (error) => {
        if (error.response.status == 401) {
            store.commit('destroyToken');
            router.push('/');
            //NProgress.done();
        }

        return Promise.reject(error);
    })

    // axios.interceptors.request.use(function (config) {
    //     NProgress.start();
    //     return config;
    // }, function (error) {
    //     console.error(error)
    //     return Promise.reject(error);
    // });
    
    // axios.interceptors.response.use(function (response) {
    //     NProgress.done();
    //     return response;
    // }, function(error) {
    //     NProgress.done();
    //     console.error(error)
    //     return Promise.reject(error);
    // });
    



    
    //axios.defaults.headers.common["Authorization"] = `Bearer ${store.getters.currentUser.token}`
}