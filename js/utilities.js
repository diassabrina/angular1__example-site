

(function() {
    'use strict';

// SET ANGULAR
angular
    .module('simuladorInvestimento', ['ui.router', 'ui.utils.masks'])
    .config(function($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('/apresentacao');
        
        $stateProvider            
            .state('apresentacao', {
                url: '/apresentacao',
                templateUrl: 'views/apresentacao.html',
                controller: 'CtrlSimulator'
            })
            .state('inicio', {
                url: '/inicio',
                templateUrl: 'views/inicio.html',
                controller: 'CtrlSimulator'
            })
            .state('objetivo', {
                url: '/objetivo',
                templateUrl: 'views/objetivo.html',
                controller: 'CtrlSimulator'
            })
            .state('investimento', {
                url: '/investimento',
                templateUrl: 'views/investimento.html',
                controller: 'CtrlSimulator'
            })            
            .state('periodo', {
                url: '/periodo',
                templateUrl: 'views/periodo.html',
                controller: 'CtrlSimulator'
            })
            .state('resultado', {
                url: '/resultado',
                templateUrl: 'views/resultado.html',
                controller: 'CtrlSimulator'
            })
            
    })
    .controller('CtrlSimulator', function($scope, $http, $location, $state) {   

        //Variaveis de verificacao
        var objetivoFinal       = $('input[name="objetivoFinal"]'),
            valorFinal          = $('input[name="valorFinal"]'),
            periodoTipoFinal    = $('input[name="periodoTipoFinal"]'),
            periodoFinal        = $('input[name="periodoFinal"]'),
            resultadoFinal      = $('input[name="resultadoFinal"]'),
            consulta 			= false;

       
        // verifica etapas
        var path       = $location.path();
        if(path == "/resultado"){
            
            if(resultadoFinal.val()=='false'){
                $state.go('periodo');
            }

        }
        else if(path == "/periodo"){
        	
        	if(objetivoFinal.val()=='false'){
                $state.go('objetivo');
            }else if (valorFinal.val()=='false'){
                $state.go('investimento');
            }

        }
        else if (path == "/investimento"){
            if(objetivoFinal.val()=='false'){
                $state.go('objetivo');
            }
            $scope.valor = valorFinal.val();
        }
        else if(path == "/objetivo"){
            $scope.classObjetivo = objetivoFinal.val();
        } 

        else {

        }


        // funcao verifica objetivo       
        $scope.validaObjetivo = function(objetivo) {
            objetivoFinal.val(objetivo);
            $state.go('investimento');
        };

        // funcao verifica valor       
        $scope.validaValor = function(valor) {
        // if ($scope.formValidaValor.$valid) {
            if(valor>=70){
                valorFinal.val(valor);
                $state.go('periodo');
            }else{
                $scope.valorIncorreto = true;
            }
        };

        // funcao  verifica Periodo       
        $scope.validaPeriodo = function(periodo, tipo) {
        	
        	var resultado  = false,
        	    mensagem   = false,
        	    erro       = false,
        	    tempo      = null,
        	    valor      = $('input[name="valorFinal"]').val();
        		


            //verifica o tempo
            if(tipo==1) {
                tempo = Math.floor(periodo/12);
            }else{
                tempo = periodo;
            }

        	
            //verifica a melhor opção de investimento (resultado)
            if( (valor >= 10000)){
            	
            	if( (tempo >= 5) ){
            		resultado = 1;
            	}else if( (tempo >= 2) && (tempo < 5) ){
            		resultado = 0;
            	}else{
            		resultado = 2;
            	}
            	
            }else if( (valor >= 2000) && (valor < 10000) ){
            	
            	if(tempo >= 5){
            		resultado = 1;
            	}else if( (tempo >= 2) && (tempo < 5) ){
            		resultado = 0;
            	}else if( (tempo < 2) ){
            		erro = true;
            		mensagem = 'Para esse valor é necessário fazer aplicações com 2 anos ou mais';
            	}

            }else if( (valor >= 70) && (valor < 2000) ){
            	
            	if(tempo >= 5){
            		resultado = 0; 
            	}else if( (tempo >= 2) && (tempo < 5) ){
            		resultado = 0; 
            	}else if( (tempo < 2) ){
            		erro = true;
            		mensagem = 'Para esse valor é necessário fazer aplicações com 2 anos ou mais';
            	}
            	
            }else{
            	erro = true;
        		mensagem = 'O valor mínimo para aplicações é de R$70,00';
            }
        	
        	//retorno 
            if(erro){
                $scope.mensagemErroPeriodo = mensagem;
                $scope.periodoIncorreto = true;
            }else{

                $state.go('resultado');
            }

            // sets
            periodoTipoFinal.val(tipo);
            periodoFinal.val(periodo);
            resultadoFinal.val(resultado);

        };


        // funcao resultado
        $scope.resultadoFinal = function() {

            if (resultadoFinal.val()!= "false"){
                var idResultado = resultadoFinal.val();            
                $http
                    .get('http://private-a4710f-investimentssimulator.apiary-mock.com/available-investments')
                    // .get('http://127.0.0.1/rico/views/pagina_dados.txt')
                    .success(function(data){
                        $scope.resultadoTitulo    = data[idResultado]['typeName'];
                        $scope.resultadoDescricao = data[idResultado]['description'];
                    });
            }

            
            
            
        };


        // sets DOM
        //classe de metodos DOM
        function Elements() {
            var self = this;

        };

            // verifica o path da url para setar header e footer            
            Elements.prototype.setElements = function(){

                var path       = $location.path(),
                    topFirst   = $('.act-header.header-first'),                
                    topSecond  = $('.act-header.header-second'),
                    footer     = $('.act-footer');

                    // se estiver na apresentacao troca o topo e mostra o footer
                    if(path == "/apresentacao"){
                        topFirst.css('display','block');
                        topSecond.css('display','none');
                        footer.css('display','block');

                    }   
                    else {                        
                        topFirst.css('display','none');
                        topSecond.css('display','block');
                        footer.css('display','none');

                    }

            }();

            // centralizacao 'HARD' de elementos
            Elements.prototype.centerElements = function() {
                var elementsDom =  $('.get-center'),
                    heightEl    =  $('.get-center').height(),
                    heightDom   =  $(window).height();

                var top =  (heightDom/2)-heightEl/2+ "px";

                elementsDom.css({
                    'top'     :  top
                })

                return this;

            };

        var Elements = new Elements();
        Elements.centerElements(); // bugs mobile

        $('html, body').animate({
            scrollTop: 0
        }, 500);


        

        // resize functions
        $(window).resize(function(){
           Elements.centerElements();
        });



    })
   

})();
