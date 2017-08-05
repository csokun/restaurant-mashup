const managerComponent = {
    bindings: { },
    template: `
    <div class="ui segment">
        <h1>Manager</h1>
        <button class="ui right aligned button yellow" ng-click="$ctrl.save()">Save</button> 
    </div>

    <div class="ui grid">
        <div class="eight wide column" ng-repeat="restaurant in $ctrl.assignments">
            <div class="ui segment">
                <h4 class="ui header">{{restaurant.name}}</h4>

                <div class="ui middle aligned divided list">
                    <div class="item" ng-repeat="table in restaurant.tables">
                        <div class="right floated content" ng-hide="!!restaurant.$_table">
                            <div class="ui button" ng-click="$ctrl.assignForm(restaurant, table)">Assign</div>
                        </div>
                        <img class="ui avatar image" src="/img/table.png">
                        <div class="content">
                            <div class="header">{{table.name}}</div>
                            <span ng-hide="!!restaurant.$_table && restaurant.$_table === table" ng-class="{'ui red horizontal label': !table.waiterId}">{{table.waiter}}</span>
                            <div ng-if="!!restaurant.$_table && restaurant.$_table == table">
                            <select class="ui dropdown" ng-model="table.waiterId">
                                <option ng-repeat="option in $ctrl.availableWaiters" value="{{option.waiterId}}">{{option.name}}</option>
                            </select>
                            <button class="ui button" ng-click="$ctrl.assigned(restaurant)">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function ($q, $http) {
        this.currentTable = null;
        this.waiters = [];
        this.assignments = [];
        this.availableWaiters = [];

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

        this.assignForm = function (restaurant, table) {
            let assignments = [];
            // setup edit mode
            restaurant.$_table = table;

            restaurant.tables.forEach(tbl => {
                if (tbl.waiter === "Unassigned") return;    // ignore

                let assigned = assignments.find(assign => assign.waiterId == tbl.waiterId);
                if (!assigned) {
                    assignments.push({
                        waiterId: tbl.waiterId,
                        count: 1
                    });
                } else {
                    assigned.count ++;
                }
            });

            let excludedWaiters = assignments.filter(assign => assign.count == 4)
                .map(rec => {
                    return rec.waiterId;
                });
            
            // using name matching is not a good idea
            // but since I am sure there aren't any name clash
            this.availableWaiters = this.waiters.filter(waiter => excludedWaiters.indexOf(waiter.username) === -1);
            setTimeout(() => {
                $('.ui.dropdown').dropdown();
            }, 0);
        }

        /**
         * Assign waiter to table but does not persist the allotments
         */
        this.assigned = function (restaurant) {
            let selectedWaiter =  this.availableWaiters.find(waiter => waiter.waiterId == restaurant.$_table.waiterId);
            restaurant.$_table.waiter = selectedWaiter.name;
            restaurant.$_table = null;
        }

        /**
         * Persist the assignments
         */
        this.save = function () {
            let payload = [];
            this.assignments.forEach(restaurant => {
                let assigned = restaurant.tables.filter(table => !!table.waiterId)
                    .map(table => {
                        return {
                            table: table.name,
                            restaurantId: restaurant.restaurantId,
                            waiterId: table.waiterId
                        }
                    });

                if (assigned.length > 0) {
                    payload = [...payload, ...assigned];
                }
            });

            $http.post('/api/assignments', JSON.stringify(payload))
                .then(result => {
                    alert('Save completed!');
                }).catch(error => {
                    console.error(error);
                });
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