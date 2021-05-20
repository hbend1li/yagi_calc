const antenna = require('./settings.js');

function rechnen() {

    let freq = antenna.freq;                                // in [Mhz]
    let parasitic = antenna.diameter_of_parasitic_elements; // in [mm]
    let boom = antenna.diameter_of_boom;			        // in [mm]
    let elements = antenna.elements;
    let lambda = 3e5 / antenna.freq;
    let abstand = new Array();
    let dimension = new Array();
    let result = new Array();
    let j;

    result = "\n**** YAGI UDA ANTENNA ***************************************\n";
    result = result + " Design by www.changpuak.ch\n";

    result = result + " https://www.changpuak.ch/electronics/yagi_uda_antenna.php" +'\n';
    result = result + " Javascript Version 10.11.2020, based on Rothammel / DL6WU" +'\n';
    result = result + " moded by Hamza BENDALI BRAHAM\n";
    result = result + "*************************************************************\n\n";

    let boom_dicke_lambda=0;
    let direktor_lambda=0;
    
    for (j=0;j<=21;j=j+1){
        abstand[j] = Math.round( 0.2 * lambda * j );
    }				

    // dimension[0] = Anzahl Elemente
    // dimension[1] = Reflektor
    // dimension[2] = Dipol
    // dimension[3] = Direktor #1
    // dimension[4] = Direktor #2 ... usw ...
    
    if (elements==3){ 
        dimension[0]=3; 
        dimension[1]=0.482; 
        dimension[2]=0.4752; 
        dimension[3]=0.442; 
    };
    if (elements==5){ 
        dimension[0]=5; 
        dimension[1]=0.482; 
        dimension[2]=0.4752; 
        dimension[3]=0.428; 
        dimension[4]=0.424; 
        dimension[5]=0.428; 
    };
    if (elements==7){ 
        dimension[0]=7; 
        dimension[1]=0.482; 
        dimension[2]=0.4752; 
        dimension[3]=0.428; 
        dimension[4]=0.420; 
        dimension[5]=0.420;  
        dimension[6]=0.428;
    };

    // KONTROLLE DICKENVERHAELTNIS BOOM
    boom_dicke_lambda = boom / lambda ;
    if (boom_dicke_lambda <= 0.002 ) {boom_dicke_lambda=0.002 ; boom = lambda * 0.002 };
    if (boom_dicke_lambda >= 0.04 ) {boom_dicke_lambda=0.04 ; boom = lambda * 0.04 };
    
    // KONTROLLE DICKENVERHAELTNIS DIREKTOREN
    direktor_lambda = parasitic / lambda ;
    if (direktor_lambda <= 0.001) {direktor_lambda = 0.001 ; parasitic = lambda * 0.001 };
    if (direktor_lambda >= 0.04) {direktor_lambda = 0.04 ; parasitic = lambda * 0.04 };
    
    result = result + "-------------------------------------------------------------\n";
    result = result + " Frequency                : " + freq + "  MHz\n";
    result = result + " Wavelength               : " + Math.round(1000*lambda)/1000 + "  mm\n";
    result = result + " d/lambda                 : " + Math.round(1000*direktor_lambda)/1000 + "  ( min.: 0.001 , max.: 0.04 )\n";
    result = result + " D/lambda                 : " + Math.round(1000*boom_dicke_lambda)/1000 + "  ( min.: 0.002 , max.: 0.04 )\n";

    let dl = direktor_lambda;
    let laenge_lambda = (elements -1 )* 0.2 ;
    
    // -------------------------------------------------------------------------
    // Gain by David VK3AUU
    let g1 = 3.39 * Math.log(laenge_lambda) + 9.15 ;			
    // Gain by Ring WA2PHW
    let g2 = 10 * Math.log(5.4075 * laenge_lambda + 4.25) / Math.log(10);	
    // Gain by Rainer Bertelsmaier DBJ9BV
    let g3 = 7.773 * Math.log(laenge_lambda) / Math.log(10) + 9.28;

    let gain = (g1 + g2 + g3) / 3 ;
    // -------------------------------------------------------------------------

    result = result + " Boomlength               : " + Math.round((elements-1) * 0.2 * lambda) + "  mm\n";
    result = result + " Elements                 : " + elements + "\n";
    result = result + " Gain                     : " + Math.round(10*gain)/10 + "  dB (approx.)\n";
    result = result + "-------------------------------------------------------------\n";
    
    abstand[0] = 0;
    dimension[0] = lambda * ( 0.4593 - 0.005 * Math.log(dl));   // REFLECTOR
    result = result + " Reflector Length      -1 : " + Math.round(dimension[0]) + "  mm\n";
    result = result + " Reflector Position       : " + Math.round(abstand[0]) + "  mm\n";
    
    abstand[1] = 0.2 * lambda ;
    dimension[1] = 0.482 * lambda ;   // DIPOLE
    result = result + "-------------------------------------------------------------\n";
    result = result + " Dipole Length (Driven) 0 : " + Math.round(dimension[1]) + "  mm\n";
    result = result + " Dipole Position          : " + Math.round(abstand[1]) + "  mm\n";

    j=1;
    elements = elements -2 ;

    while ( elements > 0 ){
        j++;
        abstand[j] = 0.2 * j * lambda ;
        dimension[j] = lambda * (-44674*dl*dl*dl*dl+2008.3*dl*dl*dl+23.178*dl*dl-3.1463*dl+0.4675)   // DIRECTOR
        dimension[j] = dimension[j] + lambda * ( 0.5 * boom_dicke_lambda + 0.002 ) // KORREKTUR AUFGRUND D/Lambda
        result = result + "-------------------------------------------------------------\n";
        result = result + " Director Length       "+((' '+(j)).slice(-2))+" : " + Math.round(dimension[j]) + "  mm\n";
        result = result + " Director Position        : " + Math.round(abstand[j]) + "  mm\n";
        elements = elements - 1; 
    }

    result = result + "-------------------------------------------------------------\n";
    result = result + " Calculations based on NBS TECHNICAL NOTE 688\n";
    result = result + " Length might be slightly too long.\n";
    result = result + " Manufacturing Tolerances : < "  + Math.round(0.002*lambda) + "  mm\n";

    result = result + "-------------------------------------------------------------\n";
    const pi = 3.141592653;
    const vf = 0.9209525 ; 
    result = result + " Folded Dipole            : res/dipole_folded.png\n";
    result = result + " Lenght A                 : " + (lambda * 0.19 * vf).toFixed(2) + "  mm\n";
    result = result + " Lenght B                 : " + (lambda * 0.10 * vf).toFixed(2) + "  mm\n";
    result = result + " Lenght C                 : " + (lambda * 0.40 * vf).toFixed(2) + "  mm\n";
    result = result + " Lenght D                 : " + (lambda * 0.20 * vf).toFixed(2) + "  mm\n";
    result = result + " Lenght Gap               : " + (lambda * 0.01 * vf).toFixed(2) + "  mm\n";
    result = result + " Radius R                 : " + (lambda * ( 0.10 / pi ) * vf).toFixed(2) + "  mm\n";
    result = result + " Rod Diameter             : " + (lambda / 300 ).toFixed(2) + "  mm\n";
    result = result + " Total Length             : " + (lambda * vf).toFixed(2) + "  mm\n";

    // https://www.nonstopsystems.com/radio/frank_radio_antenna_folded_dipole.htm
    result = result + "-------------------------------------------------------------\n";

    return result;
}


console.log(rechnen());