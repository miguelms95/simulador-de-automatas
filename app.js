/*
* Software developed by Miguel Martínez Serrano, 2017 miguelms.es 
* */

var campo_alfabeto_raw,campo_transiciones_raw,cadena_raw;
var alfabeto = [], transiciones = [], cadena, estadoInicial, estadosFinales=[];
var check,estadoActual;

$().ready(function() {
    $('#contenedor_resultadosimulacion').css("display","none");
    $('#aceptacion').css("display","none");
    $('#no_aceptacion').css("display","none");
});

$('#bt_simular').click(function () {
    $('#traza_pasos ul li').remove();
    simular();
});

function simular () {
    inicializa();
    compruebaCadena();

    if(check==1){
        $('#contenedor_resultadosimulacion').css("display","block");
    }

    ejecutaSimulador();

    reiniciarVariables();
}

function ejecutaSimulador() {
    var traza = "";
    estadoActual = estadoInicial;

    console.log(transiciones);

    //console.log("simbolo:"+simbolo+" ;cadena:"+cadena);
    traza += cadena +" - "+estadoActual+"\n";
    $('#traza_pasos ul').append('<li>'+cadena +' - '+estadoActual+'</li>');
    while(cadena.length>0){

        var simbolo = cadena.substr(0,1);
        cadena = cadena.substring(1);

        transicion(simbolo);

        if(cadena.length>0){
            traza += cadena +" - "+estadoActual+"\n";
            $('#traza_pasos ul').append('<li>'+cadena +' - '+estadoActual+'</li>');
        }else{
            traza += "λ - "+estadoActual+"\n";
            $('#traza_pasos ul').append('<li>λ - '+estadoActual+'</li>');
        }


    }

    if(verificaEstadoFinal(estadoActual)==1){
        traza += "\nEstado final: "+estadoActual+"\n";
        $('#traza_pasos ul').append('<li>Estado final: '+estadoActual+'</li>');
        $('#no_aceptacion').css("display","none");
        $('#aceptacion').css("display","block");
    }else{
        traza += "\nEstado final: "+estadoActual+"\n";
        $('#traza_pasos ul').append('<li>Estado final: '+estadoActual+'</li>');
        $('#no_aceptacion').css("display","block");
        $('#aceptacion').css("display","none");
    }
    $('#traza_simulador').css("height","250px");
    $('#traza_simulador').val(traza);

}

/**
 * Le paso un símbolo y un estado y me devuelve el nuevo estado
 * @param simbolo
 * @param estado
 */
function transicion(simbolo) {
    for(var i=0;i<transiciones.length;i++){
        if(transiciones[i][0] == estadoActual && transiciones[i][1]==simbolo){
            estadoActual = transiciones[i][2];
        }
    }
}

/**
 * Compruebo si al final está en estado de aceptación o no
 * @param estadoFinalSimulacion
 * @returns {number}
 */
function verificaEstadoFinal(estadoFinalSimulacion) {
    for(var i=0;i<estadosFinales.length;i++){
        if(estadosFinales[i] == estadoFinalSimulacion)
            return 1;
    }
    return 0;
}

/**
 * Inicializo variables del simulador
 */
function inicializa(){
    campo_alfabeto_raw = $('#campo_alfabeto').val();
    campo_transiciones_raw = $('#campo_transiciones').val();
    cadena_raw = $('#campo_cadena').val();

    cadena = cadena_raw.split("\n");
    cadena = cadena[0];

    if(campo_alfabeto_raw.length >0)
        alfabeto = campo_alfabeto_raw.split(",");
    else{
        alert("Debes rellenar el alfabeto con al menos un símbolo")
        $('#campo_alfabeto').focus();
        check=0;
    }

    inicializaEstados();
    compruebaTransiciones();
}

/**
 * Inicializo y compruebo estado inicial y posibles estados finales
 */
function inicializaEstados() {
    // inicializo el estado inicial
    estadoInicial = $('#campo_estadoInicial').val();
    estadoInicial.split(" ").join("");
    if(!(estadoInicial.length>0)){
        alert("Debes introducir un estado inicial");
        check=0;
    }
    //console.log(estadoInicial);

    //inicializo estados finales
    var estadosfinalesraw = $('#campo_estadoFinal').val().split(",");
    for(var i=0;i<estadosfinalesraw.length;i++){
        //estadosfinalesraw[i].split(" ").join("");
        //estadosfinalesraw[i].replace(/ /g,'');
        estadosFinales.push(estadosfinalesraw[i]);
    }
    //console.log(estadosFinales+", length: "+estadosFinales.length);
    if(!(estadosFinales[0].length>0)){
        alert("Debes introducir al menos un estado final");
        $('#campo_estadoFinal').focus();
        check=0;
    }
    //console.log(estadosFinales);
}

/**
 * Compruebo que las transiciones introducidas sean validas
 */
function compruebaTransiciones(){
    var todasLasTransiciones_raw = campo_transiciones_raw.split(/\r|\n/);
    var todasLasTransiciones = [];
    for(var i=0;i<todasLasTransiciones_raw.length;i++){
        if(todasLasTransiciones_raw[i].length>4 && todasLasTransiciones_raw[i].includes(",")){ // si tiene estado inicial "," simbolo "," y nuevo estado lo proceso
            todasLasTransiciones.push(todasLasTransiciones_raw[i])
        }
    }

    for(var j=0; j<todasLasTransiciones.length; j++){
        transiciones.push(todasLasTransiciones[j].split(","));  // ya tengo las transiciones
    }
    //console.log(transiciones);
}

/**
 * Compruebo la cadena introducida tenga solo elementos del alfabeto
 */
function compruebaCadena() {
    var huboerror;
    for(var i=0;i<cadena.length;i++){
        if(compruebaSimbolo(cadena[i])==0){
            huboerror = 1;
            break
        }else
            console.log("todo correcto");
    }
    if(huboerror!=1 && check != 0)
        check = 1;
}
/**
 * funcion para comprobar si el símbolo pasado por parametro pertenece al alfabeto
 * @param simbolo
 * @returns {number}
 */
function compruebaSimbolo (simbolo) {
    for (var i=0;i<alfabeto.length;i++){
        if(simbolo == alfabeto[i])
            return 1;
    }
    if(check!=0)
        alert("Has introducido en la cadena: \""+cadena+"\" el símbolo \""+simbolo+"\" que no existe en el alfabeto: "+campo_alfabeto_raw);
    return 0;
}

/**
 * Función para reiniciar variables después de una ejecución del somilador
 */
function reiniciarVariables() {
    campo_alfabeto_raw=undefined;
    campo_transiciones_raw=undefined;
    cadena_raw=undefined;
    alfabeto = [], transiciones = [], cadena=undefined, estadoInicial = undefined, estadosFinales=[];
    estadoActual = undefined;
    check=undefined;
}