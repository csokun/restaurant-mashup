const managerComponent = {
    bindings: { },
    template: `<h1>Manager</h1>`,
    controller: function () {
        this.$onInit = function () {
            console.log('manager::init()');
        }
    }
};

const waiterComponent = {
    bindings: { },
    template: `<h1>Waiter</h1>`,
    controller: function () {
        this.$onInit = function () {
            console.log('waiter::init()');
        }
    }
};

const pwc = {
    template: `
        <div>
            <manager ng-if="$ctrl.user.is_manager"></manager>
            <waiter ng-if="!$ctrl.user.is_manager"></waiter>
        </div>
    `,
    controller: function ($http) {
        this.waiters = [];
        
        this.$onInit = function () {
            console.log('pwc::app::init()');

            $http.get('/api/users').then(res => {
                this.waiters = res.data;
            });
        }
    }
};

angular
    .module('pwc', [])
    .component('pwc', pwc)
    .component('manager', managerComponent)
    .component('waiter', waiterComponent)
    .config(function($compileProvider) {
        
    });

angular.bootstrap(document.documentElement, ['pwc']);