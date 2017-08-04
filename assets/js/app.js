const managerComponent = {
    bindings: { },
    template: `
    <h1>Manager</h1>
    <div class="ui grid">
        <div class="eight wide column" ng-repeat="restaurant in $ctrl.assignments">
            <div class="ui piled segment">
                <h4 class="ui header">{{restaurant.name}}</h4>

                <div class="ui middle aligned divided list">
                    <div class="item" ng-repeat="table in restaurant.tables">
                        <div class="right floated content">
                            <div class="ui button" ng-click="$ctrl.assign(restaurant, table)">Assign</div>
                        </div>
                        <img class="ui avatar image" src="/img/table.png">
                        <div class="content">
                            <div class="header">{{table.name}}</div>
                            {{table.waiter}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function ($q, $http) {
        this.$onInit = function () {
            console.log('manager::init()');
            $q.all([
                $http.get('/api/waiters'),
                $http.get('/api/assignments')
            ]).then(results => {
                this.waiters = results[0].data;
                this.assignments = results[1].data;
            });
        }

        this.assign = function (restaurant, table) {
            console.log(table);
        }
    }
};

const waiterComponent = {
    bindings: { },
    template: `
    <h1>Waiter</h1>
    <div class="ui grid">
        <div class="twelve wide column" ng-repeat="assign in $ctrl.data.assigned">
            <div class="ui piled segment">
                <h4 class="ui header">{{assign.restaurant}}</h4>
                <ul>
                    <li ng-repeat="table in assign.tables">{{table}}</li>
                <ul>
            </div>
        </div>
        <div class="twelve wide column" ng-if="$ctrl.data.assigned.length == 0">
            <div class="ui piled segment">
                <h4 class="ui header">Oop! no table assigned</h4>
                <p>Have a nice day :)</p>
            </div>
        </div>
    </div>
    `,
    controller: function ($http) {
        this.$onInit = function () {
            console.log('waiter::init()');

            $http.get(`/api/waiters/${CURRENT_USER.username}`)
                .then(res => {
                    this.data = res.data;
                    console.log(this.assigned);
                });
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
        this.$onInit = function () {
            console.log('pwc::app::init()');
            this.user = CURRENT_USER;
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