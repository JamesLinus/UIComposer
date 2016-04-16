var composer = angular.module('composer', ['as.sortable', 'ngDraggable', 'ngSanitize']);

composer.controller('HomeController', function ($scope, $sce, $compile) {
    $scope.list = [
        {
            "type" : "hr",
            "template" : "<hr />"
        },{
            "type" : "br",
            "template" : "<br />"
        },
        {
            "type" : "input text",
            "template" : '<input type="text" class="form-control" ng-placeholder="item.attr.placeholder" />',
            "attr" : {
                placeholder: "Input Text Placeholder",
            }
        },
        {
            "type" : "input password",
            "template" : '<input type="password" class="form-control" ng-placeholder="item.attr.placeholder" />',
            "attr" : {
                placeholder: "Password placeholder",
            }
        },
        /*{
            "type" : "input number",
            "template" : '<input type="number" class="form-control" ng-model="item.attr.text" />',
            "attr" : {
                text: "0",
            }
        },*/
        {
            "type" : "form label",
            "template" : '<label>{{item.attr.text}}</label>',
            "attr" : {
                text : "Label"
            }
        },
        {
            "type" : "label",
            "class" : "label label-default",
            "attr" : {
                text : "Label",
                type : [
                    {
                        "id": "label-default",
                        "label": "Default"
                    },{
                        "id": "label-primary",
                        "label": "Primary"
                    },{
                        "id": "label-success",
                        "label": "Success"
                    },{
                        "id": "label-info",
                        "label": "Info"
                    },{
                        "id": "label-warning",
                        "label": "Warning"
                    },{
                        "id": "label-danger",
                        "label": "Danger"
                    }
                ]
            }
        },{
            "type" : "header",
            "class" : "h1",
            "attr" : {
                text : "Header",
                type : [
                    {
                        "id": "h1",
                        "label": "H1"
                    },{
                        "id": "h2",
                        "label": "H2"
                    },{
                        "id": "h3",
                        "label": "H3"
                    },{
                        "id": "h4",
                        "label": "H4"
                    }
                ]
            }
        },{
            "type" : "button",
            "class" : "btn btn-default",
            "attr" : {
                text : "Button",
                size : [
                    {
                        "id": "",
                        "label": "Default"
                    },{
                        "id": "btn-xs",
                        "label": "Extra Small"
                    },{
                        "id": "btn-sm",
                        "label": "Small"
                    },{
                        "id": "btn-lg",
                        "label": "Large"
                    }
                ],
                type : [
                    {
                        "id": "btn-default",
                        "label": "Default"
                    },{
                        "id": "btn-primary",
                        "label": "Primary"
                    },{
                        "id": "btn-success",
                        "label": "Success"
                    },{
                        "id": "btn-info",
                        "label": "Info"
                    },{
                        "id": "btn-warning",
                        "label": "Warning"
                    },{
                        "id": "btn-danger",
                        "label": "Danger"
                    },{
                        "id": "btn-link",
                        "label": "Link"
                    }
                ],
                float : [
                    {
                        "id": "",
                        "label": "None"
                    },{
                        "id": "pull-left",
                        "label": "Left"
                    },{
                        "id": "pull-right",
                        "label": "Right"
                    }
                ]
            }
        }
    ];

    $scope.layout = [];

    $scope.onDropComplete = function($data,$event){
        console.log("---",$data,$event);
        $scope.layout.push(angular.copy($data));
    };

    $scope.selectItem = function(item, $index){
        $scope.selectedItem = item;
        $scope.selectedItemIndex = $index;
        console.log("$scope.selectedItem",$scope.selectedItem);
    };

    $scope.getAttributeType = function(value){
        return typeof(value);
    };

    $scope.selectAction = function(key, myOption){
        switch (key) {
            case "size" : changeSize(myOption); break;
            case "type" : changeType(myOption); break;
            case "float" : changeFloat(myOption); break;
        }

    };

    function getElementsFloatClasses(){
        var classes = {
            "button" : ["pull-left", "pull-right"]
        };
        return classes[$scope.selectedItem.type];
    }
    function getElementsSizeClasses(){
        var classes = {
            "button" : ["btn-xs", "btn-sm", "btn-lg"]
        };
        return classes[$scope.selectedItem.type];
    }

    function getElementsTypeClasses(){
        var classes = {
            "label" : ["label-default", "label-primary", "label-success", "label-info", "label-warning", "label-danger"],
            "button" : ["btn-default", "btn-primary", "btn-success", "btn-info", "btn-warning", "btn-danger", "btn-link"],
            "header" : ["h1", "h2", "h3", "h4"]
        };
        return classes[$scope.selectedItem.type];
    }

    function changeSize(myOption){
        var classes = $scope.selectedItem.class.split(" ");
        var sizeClasses = getElementsSizeClasses();
        var x = classes.filter(function(i) {
            return sizeClasses.indexOf(i) < 0;
        });

        x.push(myOption.id);
        $scope.selectedItem.class = x.join(" ");
    }

    function changeType(myOption){
        var classes = $scope.selectedItem.class.split(" ");
        var typeClasses = getElementsTypeClasses();
        var x = classes.filter(function(i) {
            return typeClasses.indexOf(i) < 0;
        });

        x.push(myOption.id);
        $scope.selectedItem.class = x.join(" ");

    }

    function changeFloat(myOption){
        var classes = $scope.selectedItem.class.split(" ");
        var floatClasses = getElementsFloatClasses();
        var x = classes.filter(function(i) {
            return floatClasses.indexOf(i) < 0;
        });

        x.push(myOption.id);
        $scope.selectedItem.class = x.join(" ");

    }

    $scope.trustedHtml = function(item){
        console.log("---", item);
        return $sce.trustAsHtml(item.template);
    };

    $scope.dropSelectedElemet = function(){
        $scope.layout.splice($scope.selectedItemIndex, 1);
    };

});

composer.directive('compileTemplate', function($compile, $parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var parsed = $parse(attr.ngBindHtml);

            //Recompile if the template changes
            scope.$watch(
                function() {
                    return (parsed(scope) || '').toString();
                },
                function() {
                    $compile(element, null, -9999)(scope);
                }
            );
        }
    };
});

composer.directive('ngPlaceholder', function() {
    return {
        restrict: 'A',
        scope: {
            placeholder: '=ngPlaceholder'
        },
        link: function(scope, elem, attr) {
            scope.$watch('placeholder',function() {
                elem[0].placeholder = scope.placeholder;
            });
        }
    }
});

composer.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');
        }
    }
});
