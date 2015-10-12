var myApp = angular.module("myApp",["angular.multi.bar"]);

myApp.controller("appController",["$scope",
    function($scope){
        $scope.multiBars = [
            {
                multiBarOptions: {
                    min:0,
                    max:10,
                    thermometer:true
                },
                multiBarValue:[
                    4 
                ]
            },
            {
                multiBarOptions: {
                    min:10,
                    max:100,
                    multiBarValue:[
                        {
                            visibility:"visible",
                            val:25,
                            bgColor:"yellow"
                        },
                        {
                            visibility:"visible",
                            val:50,
                            bgColor:"green"
                        },
                        {
                            visibility:"visible",
                            val:80,
                            bgColor:"red"
                        },
                        {
                            visibility:"visible",
                            val:100,
                            bgColor:"blue"
                        }
                    ],
                    shadow:"top_right"
                }
            },
            {
                multiBarValue:[
                    5 
                ]
            }
        ];
        
        $scope.changeOptions = function(){
            $scope.multiBars[1].multiBarOptions ={
                min: 200,
                max: 300,
                multiBarValue: [
                        {
                            visibility:"visible",
                            val:220,
                            bgColor:"yellow"
                        },
                        {
                            visibility:"visible",
                            val:230,
                            bgColor:"green"
                        },
                        {
                            visibility:"visible",
                            val:270,
                            bgColor:"red"
                        },
                        {
                            visibility:"visible",
                            val:280,
                            bgColor:"blue"
                        },
                        {
                            visibility:"visible",
                            val:300,
                            bgColor:"black"
                        }
                    ],
                type:"hot",
                shadow:"bottom_right"
            }
        }
        $scope.changeValues = function(){
            $scope.multiBars[1].multiBarValue = [210]
        }
    }
]);