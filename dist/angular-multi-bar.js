(function(){
    'use strict';
    
    angular.module('angular.multi.bar', [])
    .constant('multibarConfig', {
        module_version:"0.4.0",
        optionsDefault:{
            min:0,
            max:10,
            type:"normal",
            thermometer:false,
            reverse:false,
            posMarker:"outside",
            iconMarker:"arrow-down",
            multiBarValue:[
                {
                    visibility:"visible",
                    val:2,
                    bgColor:"green"
                },
                {
                    visibility:"visible",
                    val:4,
                    bgColor:"yellow"
                },
                {
                    visibility:"visible",
                    val:6,
                    bgColor:"orange"
                },
                {
                    visibility:"visible",
                    val:8,
                    bgColor:"red"
                },
                {
                    visibility:"visible",
                    val:10,
                    bgColor:"purple"
                }
            ],
            multiBarValueVisibility:"visible",
            shadow:false
        },
        colors:{
            defaults: ["green","yellow","orange","red","purple","blue","black","white"],
            hot:["#F9F9BD","#F7F411","#ECD024","#FFA500","#E08E00","#FF350A","#E90000","#BE0028","#C10069","#8A0079"],
            cold:["#A4FCB7","#A4FCD6","#A4FCF5","#A4F2FC","#A4E1FC","#A4CDFC","#A4ACFC","#5479CE","#4759FF","#0019FF"]
        },
        shadow_type:{
            center:"box-shadow:0 0px 4px 0 #666",
            top:"box-shadow:0px -2px 2px 0 #666",
            left:"box-shadow:-3px 0 2px 0 #666",
            right:"box-shadow:3px 0 2px 0 #666",
            bottom:"box-shadow:0px 2px 2px 0 #666",
            top_left:"box-shadow:-2px -2px 2px 0 #666",
            top_right:"box-shadow:2px -2px 2px 0 #666",
            bottom_left:"box-shadow:-2px 2px 2px 0 #666",
            bottom_right:"box-shadow:2px 2px 2px 0 #666"
        }
    })
    .controller('multibarController', ['$scope','multibarConfig', multibarController])
    .directive('angularMultiBar',
        function (multibarConfig) {
            return {
                restrict: 'E',
                scope:{
                    options:'=',
                    value:'='
                },
                controller: 'multibarController',
                link: function (scope, element, attrs) {
                    var options = scope.checkOptions(scope.options);
                    var value = scope.value;
                    var control = scope.control || {};
                    
                    scope.constructorBar(options,element);
                    if(value)
                        scope.setValue(value,options,element);
                    
                    scope.$watchCollection('options', 
                        function(newValue, oldValue) {
                            if(newValue != oldValue){
                                var value = scope.value;
                                scope.constructorBar(newValue,element);
                                if(value)
                                    scope.setValue(value,newValue,element);
                            }
                        }, 
                    true);
                    scope.$watchCollection('value', 
                        function(newValue, oldValue) {
                            if(newValue != oldValue){
                                var options = scope.checkOptions(scope.options);
                                scope.setValue(newValue,options,element);
                            }
                        }, 
                    true);
                }
            }
        }
    );
    
    function multibarController($scope,multibarConfig) {
        var createBar = function(options){
            var mulBar = '<div class="multi-bar-box'
            if(options.reverse)
                mulBar += ' reverse ';
            mulBar+='" ';
            var shadow = options.shadow && multibarConfig.shadow_type[options.shadow];
            if(shadow)
                mulBar+= ' style="' + multibarConfig.shadow_type[options.shadow] + '"';
            mulBar+='>';
            for(var b=0;b<options.multiBarValue.length;b++){
                var value = options.multiBarValue[b].val;
                var width = b==0 ? 'width:' + ((options.multiBarValue[b].val-options.min)/(options.max-options.min))*100 + '%':'width:' + ((options.multiBarValue[b].val-options.multiBarValue[b-1].val)/(options.max-options.min))*100 + '%';
                var bg = options.multiBarValue[b].bgClass ? 'class="multi-bar-bar ' + options.multiBarValue[b].bgClass + '" style="' + width + '"':options.multiBarValue[b].bgColor ? 'class="multi-bar-bar" style="background-color:' + options.multiBarValue[b].bgColor + ';' + width + '"':'class="multi-bar-bar" style="' + width + '"';
                mulBar+='<div ' + bg + '></div>';
            }
            mulBar+='</div>'
            var valBar = '<div class="multi-bar-value-content"><div class="multi-bar-initVal">' + options.min + '</div>';
            if(options.reverse)
                valBar = '<div class="multi-bar-value-content reverse"><div class="multi-bar-initVal">' + options.min + '</div>';
            for(var c=0;c<options.multiBarValue.length;c++){
                if(options.multiBarValue[c].val==options.max)
                    valBar+='<div class="multi-bar-value-box" style="width:' + ((options.multiBarValue[c].val-options.multiBarValue[c-1].val)/(options.max-options.min))*100 + '%"></div>';
                else if(c==0){
                    var visibility = options.multiBarValue[c].visibility ? options.multiBarValue[c].visibility : "visible";
                valBar+='<div class="multi-bar-value-box ' + visibility + '" style="width:' + ((options.multiBarValue[c].val-options.min)/(options.max-options.min))*100 + '%;"><div class="multi-bar-value">' + options.multiBarValue[c].val + '</div></div>';
                }
                else{
                    var visibility = options.multiBarValue[c].visibility ? options.multiBarValue[c].visibility : "visible";
                    valBar+='<div class="multi-bar-value-box ' + visibility + '" style="width:' + ((options.multiBarValue[c].val-options.multiBarValue[c-1].val)/(options.max-options.min))*100 + '%;"><div class="multi-bar-value">' + options.multiBarValue[c].val + '</div></div>';
                }
            }
            valBar+='<div class="multi-bar-lastVal">' + options.max + '</div></div>';
            return {mulBar:mulBar,valBar:valBar}
        };
        
        var createBar_hot = function(options){
            var mulBar = '<div class="multi-bar-box'
            if(options.reverse)
                mulBar += ' reverse ';
            mulBar+='" ';
            var shadow = options.shadow && multibarConfig.shadow_type[options.shadow];
            if(shadow)
                mulBar+= ' style="' + multibarConfig.shadow_type[options.shadow] + '"';
            mulBar+='>';
            var indice = options.min;
            for(var b=0;b<multibarConfig.colors.hot.length;b++){
                mulBar+='<div class="multi-bar-bar" style="background-color:' + multibarConfig.colors.hot[b] + ';width:10%"></div>';
            }
            mulBar+='</div>'

            var valBar = '<div class="multi-bar-value-content"><div class="multi-bar-initVal">' + options.min + '</div>';
            if(options.reverse)
                valBar = '<div class="multi-bar-value-content reverse"><div class="multi-bar-initVal">' + options.min + '</div>';
            var indice = options.min;
            for(var c=0;c<multibarConfig.colors.hot.length;c++){
                indice+=((options.max-options.min)/10)
                if(c==multibarConfig.colors.hot.length-1)
                    valBar+='<div class="multi-bar-value-box" style="width:10%"></div>';
                else 
                    valBar+='<div class="multi-bar-value-box" style="width:10%"><div class="multi-bar-value">' + indice.toFixed(1) + '</div></div>';
            }
            valBar+='<div class="multi-bar-lastVal">' + options.max + '</div></div>';

            return {mulBar:mulBar,valBar:valBar}
        }

        var createBar_cold = function(options){
            var mulBar = '<div class="multi-bar-box'
            if(options.reverse)
                mulBar += ' reverse ';
            mulBar+='" ';
            var shadow = options.shadow && multibarConfig.shadow_type[options.shadow];
            if(shadow)
                mulBar+= ' style="' + multibarConfig.shadow_type[options.shadow] + '"';
            mulBar+=' ">';
            var indice = options.min;
            for(var b=0;b<multibarConfig.colors.cold.length;b++){
                mulBar+='<div class="multi-bar-bar" style="background-color:' + multibarConfig.colors.cold[b] + ';width:10%"></div>';
            }
            mulBar+='</div>'

            var valBar = '<div class="multi-bar-value-content"><div class="multi-bar-initVal">' + options.min + '</div>';
            if(options.reverse)
                valBar = '<div class="multi-bar-value-content reverse"><div class="multi-bar-initVal">' + options.min + '</div>';
            var indice = options.min;
            for(var c=0;c<multibarConfig.colors.cold.length;c++){
                indice+=((options.max-options.min)/10)
                if(c==multibarConfig.colors.cold.length-1)
                    valBar+='<div class="multi-bar-value-box" style="width:10%"></div>';
                else 
                    valBar+='<div class="multi-bar-value-box" style="width:10%"><div class="multi-bar-value">' + indice.toFixed(1) + '</div></div>';
            }
            valBar+='<div class="multi-bar-lastVal">' + options.max + '</div></div>';

            return {mulBar:mulBar,valBar:valBar}
        }
        
        var createMarker = function(arValue,options){
            var marker = '<div class="multi-bar-marker-content';
            if(options.posMarker && options.posMarker==="inside")
                marker += ' inside ';
            var direction = "left";
            if(options.reverse){
                marker += ' reverse ';
                direction = "right"
            }
            marker+='">'
            var icon = 'arrow-down';
            if(options.iconMarker)
                icon = options.iconMarker;
            for(var i=0;i<arValue.length;i++){
                var value;
                var color;
                var objValue = arValue[i] && typeof arValue[i]=='object';
                if(objValue){
                    value=arValue[i].value;
                    color=arValue[i].color;
                }
                else{
                    value=arValue[i];
                    color="black";
                }
                var markerPosition = ((value-options.min)/(options.max-options.min))*100;
                if(value>options.max)
                    markerPosition=100;
                else if(value<options.min)
                    markerPosition=0;
                marker+= '<div class="multi-bar-marker" style="' + direction + ':' + markerPosition + '%;color:' + color + '">' + 
                    '<div class="multi-bar-marker-value">' + value + '</div>' + 
                    '<span class="icon-' + icon + '"></span>' +
                    '</div>'; 
            }
            marker+='</div>';
            return marker;
        }

        $scope.constructorBar = function(options,ele){
            var box = '<div class="multi-bar';

            if(options.size)
                box += ' multi-bar-' + options.size + ' ';

            if(options.multiBarValueVisibility && options.multiBarValueVisibility == "hidden")
                box += ' multi-bar-value-box-hidden ';

            if(options.thermometer){
                var pos_bg_init = !options.reverse ? 0 : options.type && multibarConfig.colors[options.type] ? multibarConfig.colors[options.type].length-1 : options.multiBarValue.length-1;
                var bg_init = options.type && multibarConfig.colors[options.type] ? 'class="thermometer_init" style="background-color:' + multibarConfig.colors[options.type][pos_bg_init] + ';"' : options.multiBarValue[pos_bg_init].bgClass ? 'class="thermometer_init ' + options.multiBarValue[pos_bg_init].bgClass + '"': options.multiBarValue[pos_bg_init].bgColor ? 'class="thermometer_init" style="background-color:' + options.multiBarValue[pos_bg_init].bgColor + ';"':'class="thermometer_init"';
                box += ' thermometer"><div class="multi-bar-content no-legend"><div ' + bg_init + '></div><div class="thermometer_end"></div><div class="multi-bar-marker-content"></div>';
            }
            else
                box+='"><div class="multi-bar-content no-legend"><div class="multi-bar-marker-content"></div>';

            var bar;
            if(options.type && options.type=="hot")
                bar = createBar_hot(options);
            else if(options.type && options.type=="cold")
                bar = createBar_cold(options);
            else
                bar = createBar(options);

            box+= bar.mulBar + bar.valBar;
            box+= '</div></div>';

            if(options.initValue && typeof options.initValue == 'object'){
                $scope.setValue(options.initValue,options,ele);
            }

            ele.html(box + '<div style="clear:both"></div>');
        };
        $scope.checkOptions = function(options){
            if(!options){
                options = multibarConfig.optionsDefault;
                return options
            }
            if(!options.min && options.min!=0)
                options.min = multibarConfig.optionsDefault.min;
            if(!options.max && options.max!=0)
                options.max = multibarConfig.optionsDefault.max;
            if(!options.multiBarValue){
                options.multiBarValue = [];
                var step = (options.max-options.min)/5
                var indice = options.min+step;
                for(var i=0;i<5;i++){
                    options.multiBarValue.push(
                        {
                            visibility:"visible",
                            val:parseInt(indice),
                            bgColor:multibarConfig.colors.defaults[i]
                        }
                    );
                    indice+=(options.max-options.min)/5;
                }
            }
            var opt = angular.extend({}, multibarConfig.optionsDefault, options );
            return opt;
        };
        $scope.setValue = function(arValue,options,element){
            var marker = createMarker(arValue,options);
            angular.element(element[0].querySelector(".multi-bar-marker-content")).replaceWith(marker);
            var legend = options.legend && options.legend.show==true;
            if(legend){
                var boxLegend = createLegend(arValue,options,element);
            }
        };
        $scope.destroy = function(element){
            console.log(element);
        };
    }
    
})();