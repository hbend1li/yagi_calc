function rechnen() {
    let freq = antenna.freq;                                // in [Mhz]
    let parasitic = antenna.diameter_of_parasitic_elements; // in [mm]
    let boom = antenna.diameter_of_boom;			        // in [mm]
    let isolated = antenna.boom_isolated_from_parasitics;
    let d = parasitic;
    let elements = antenna.elements;
    let lambda = 3e5 / antenna.freq;
    let abstand = new Array();
    let result = new Array();
    let j;

    // DATA IS FROM ROTHAMMEL, PAGE 441, 11TH ED.
    abstand[0] = 0.240; // Reflector - Dipole
    abstand[1] = 0.075;	// Director #1 - Dipole
    abstand[2] = 0.180;	// Director #2 - Director #1
    abstand[3] = 0.215;	// Director #3 - Director #2
    abstand[4] = 0.250;	// usw
    abstand[5] = 0.280;
    abstand[6] = 0.300;
    abstand[7] = 0.315;
    abstand[8] = 0.330;
    abstand[9] = 0.345;
    abstand[10] = 0.360;
    abstand[11] = 0.375;
    abstand[12] = 0.385;
    abstand[13] = 0.390;
    abstand[14] = 0.395;
    abstand[15] = 0.400;
    abstand[16] = 0.400;
    abstand[17] = 0.400;
    abstand[18] = 0.400;
    abstand[19] = 0.400;
    abstand[20] = 0.400;

    let max = new Array();	// GRAPH FOR d/l = 0.01
    let min = new Array();	// GRAPH FOR d/l = 0.002

    for (j = 1; j <= 20; j++) {
        max[j] = -7E-6 * j * j * j + 0.0003 * j * j - 0.0073 * j + 0.433;
        min[j] = -3E-6 * j * j * j + 0.0002 * j * j - 0.0049 * j + 0.4595;
    }

    // LAENGE (BOOM) ALS VIELFACHES VON LAMBDA BERECHNEN

    let laenge_lambda = 0;

    for (j = 0; j < (elements - 1); j++) { laenge_lambda = laenge_lambda + abstand[j]; }

    // LAENGE IN METERN
    let boomlaenge = Math.round(laenge_lambda * lambda) / 1000;
    // ZUSAETZLICH + 2 * DURCHMESSER DIREKTOREN FUER REALISIERBARKEIT :-)
    boomlaenge = boomlaenge + (2 * parasitic / 1000);
    antenna.boomlength = boomlaenge.toFixed(3);

    // GAIN
    let gain, laenge;
    laenge = laenge_lambda - abstand[0];  // MEASURED FROM DIPOLE
    // TABLE 23.5 Rothammel p439, 11th edition
    // gain = f(laenge/lambda), gemessen ab dipol !
    gain = 3.39 * Math.log(laenge_lambda) + 9.15;
    // -------------------------------------------------------------------------
    antenna.gain = gain.toFixed(2);

    result = "";
    result = result + "https://www.changpuak.ch/electronics/yagi_uda_antenna.php\n";
    result = result + "Javascript Version 12.01.2014, based on Rothammel / DL6WU\n";
    result = result + "Moded by Hamza BENDALI BRAHAM <hbendali@ya.ru>\n";
    result = result + "-------------------------------------------------------------\n";
    result = result + " Frequency     :  " + freq + " MHz\n";
    result = result + " Wavelength    :  " + Math.round(lambda) + " mm\n";
    result = result + " Rod Diameter  :  " + d + " mm\n";
    result = result + " Boom Diameter :  " + boom + " mm\n";
    result = result + " Boom Length   :  " + Math.round(1000 * boomlaenge) + " mm\n";

    let boom_dicke_lambda;
    let direktor_lambda = 0;

    // KONTROLLE DICKENVERHAELTNIS BOOM
    boom_dicke_lambda = boom / lambda;
    if (boom_dicke_lambda <= 0.01){
        boom_dicke_lambda = 0.01; boom = lambda * 0.01;
    }else if (boom_dicke_lambda >= 0.05){
        boom_dicke_lambda = 0.05; boom = lambda * 0.05;
    }

    // CORRECT FOR D/lambda, POLYNOM 3RD ORDER TO APPROXIMATE TABLE IN ROTHAMMEL, PAGE 444 IN 11TH ED.
    let korrlaenge = -416.86 * boom_dicke_lambda * boom_dicke_lambda * boom_dicke_lambda + 46.183 * boom_dicke_lambda * boom_dicke_lambda - 0.6834 * boom_dicke_lambda + 0.0059;

    // KONTROLLE DICKENVERHAELTNIS DIREKTOREN
    direktor_lambda = parasitic / lambda;
    if (direktor_lambda <= 0.001){
        direktor_lambda = 0.001; parasitic = lambda * 0.001
    }else if (direktor_lambda >= 0.04){
        direktor_lambda = 0.04; parasitic = lambda * 0.04
    };

    result = result + " d/lambda      :  " + (Math.round(1000 * direktor_lambda) / 1000).toFixed(3) + "    ( min.: 0.002 , max.: 0.01 )\n";
    result = result + " D/lambda      :  " + (Math.round(1000 * boom_dicke_lambda) / 1000).toFixed(3) + "    ( min.: 0.01 , max.: 0.05 )\n";
    result = result + " Elements      :  " + elements + '\n';
    result = result + " Gain          :  " + gain.toFixed(2) + " dBd (approx.)\n";
    result = result + "-------------------------------------------------------------\n";

    let reflectorlength = 0.482;
    
    if (isolated){
        reflectorlength = reflectorlength + 0;
    }else{
        reflectorlength = reflectorlength + korrlaenge;
    };

    result = result + (" Reflector Length   : " + Math.round(reflectorlength * lambda) + " mm\n");
    result = result + (" Reflector Position :  0 mm\n");
    result = result + "-------------------------------------------------------------\n";
    result = result + (" Dipole Position    : " + Math.round(abstand[0] * lambda) + " mm\n");
    result = result + "-------------------------------------------------------------\n";

    let cum_length = abstand[0] * lambda;
    let direx;

    for (j = 1; j < (elements - 1); j++) {
        cum_length = cum_length + abstand[j] * lambda;

        if (isolated){
            direx = lambda * (min[j] + (max[j] - min[j]) * direktor_lambda);
        }else{
            direx = lambda * (korrlaenge + min[j] + (max[j] - min[j]) * direktor_lambda);
        };

        result = result + " Director #" + j + " Position : " + Math.round(cum_length) + " mm ,  Length : " + Math.round(direx) + " mm\n";
        if (j == 1){
            result = result + " Distance Dipole - Dir. #1 : " + Math.round(abstand[j] * lambda) + " mm\n";
        }else if (j > 1){
            result = result + " Distance Dir. #" + (j - 1) + " - Dir. #" + j + " : " + Math.round(abstand[j] * lambda) + " mm\n";
        };
        result = result + "-------------------------------------------------------------" + '\n';
    }

    if (isolated){
        result = result + " Directors / Parasitics are isolated. \n Please choose an isolater thicker than : " + (boom / 2).toFixed(1) + " mm\n";
    }else{
        result = result + " Directors / Parasitics are not isolated. \n The length has been increased to compensate for that.\n";
    };

    result = result + "-------------------------------------------------------------\n";
    const pi = 3.141592653;
    const vf = 0.9209525 ; 
    result = result + "\n- Folded Dipole ---------------------------------------------\n";
    result = result + " Image URL     :  https://www.changpuak.ch/electronics/images/DIPOLE_folded.png\n";
    result = result + " Lenght A      :  " + (lambda * 0.19 * vf).toFixed(2) + " mm\n";
    result = result + " Lenght B      :  " + (lambda * 0.10 * vf).toFixed(2) + " mm\n";
    result = result + " Lenght C      :  " + (lambda * 0.40 * vf).toFixed(2) + " mm\n";
    result = result + " Lenght D      :  " + (lambda * 0.20 * vf).toFixed(2) + " mm\n";
    result = result + " Lenght Gap    :  " + (lambda * 0.01 * vf).toFixed(2) + " mm\n";
    result = result + " Radius R      :  " + (lambda * ( 0.10 / pi ) * vf).toFixed(2) + " mm\n";
    result = result + " Rod Diameter  :  " + (lambda / 300 ).toFixed(2) + " mm\n";
    result = result + " Total Length  :  " + (lambda * vf).toFixed(2) + " mm\n";

    // https://www.nonstopsystems.com/radio/frank_radio_antenna_folded_dipole.htm
    result = result + "-------------------------------------------------------------\n";


    return result;
}

var antenna = {
    freq:2450,                          // in [MHz]
    elements:3,                         // 3..22 elements
    diameter_of_parasitic_elements:10,  // in [mm]
    diameter_of_boom:20,                // in [mm]
    boom_isolated_from_parasitics: true // true, false
};
console.log(rechnen());