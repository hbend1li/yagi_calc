const antenna = require('./settings.js');

function format(e, p) {
    return ('        ' + e.toFixed(0)).slice(-p)
}

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

    result = result + " https://www.changpuak.ch/electronics/yagi_uda_antenna.php" + '\n';
    result = result + " Javascript Version 10.11.2020, based on Rothammel / DL6WU" + '\n';
    result = result + " moded by Hamza BENDALI BRAHAM\n";
    result = result + "*************************************************************\n\n";

    let boom_dicke_lambda = 0;
    let direktor_lambda = 0;

    for (j = 0; j <= 21; j = j + 1) {
        abstand[j] = 0.2 * lambda * j;
    }

    // dimension[0] = Anzahl Elemente
    // dimension[1] = Reflektor
    // dimension[2] = Dipol
    // dimension[3] = Direktor #1
    // dimension[4] = Direktor #2 ... usw ...

    if (elements == 3) {
        dimension[0] = 3;
        dimension[1] = 0.482;
        dimension[2] = 0.4752;
        dimension[3] = 0.442;
    };
    if (elements == 5) {
        dimension[0] = 5;
        dimension[1] = 0.482;
        dimension[2] = 0.4752;
        dimension[3] = 0.428;
        dimension[4] = 0.424;
        dimension[5] = 0.428;
    };
    if (elements == 7) {
        dimension[0] = 7;
        dimension[1] = 0.482;
        dimension[2] = 0.4752;
        dimension[3] = 0.428;
        dimension[4] = 0.420;
        dimension[5] = 0.420;
        dimension[6] = 0.428;
    };

    // KONTROLLE DICKENVERHAELTNIS BOOM
    boom_dicke_lambda = boom / lambda;
    if (boom_dicke_lambda <= 0.002) { boom_dicke_lambda = 0.002; boom = lambda * 0.002 };
    if (boom_dicke_lambda >= 0.04) { boom_dicke_lambda = 0.04; boom = lambda * 0.04 };

    // KONTROLLE DICKENVERHAELTNIS DIREKTOREN
    direktor_lambda = parasitic / lambda;
    if (direktor_lambda <= 0.001) { direktor_lambda = 0.001; parasitic = lambda * 0.001 };
    if (direktor_lambda >= 0.04) { direktor_lambda = 0.04; parasitic = lambda * 0.04 };

    result = result + "-------------------------------------------------------------\n";
    result = result + " Frequency                : " + freq + "  MHz\n";
    result = result + " Wavelength               : " + ((1000 * lambda) / 1000).toFixed(3) + "  mm\n";
    result = result + " d/lambda                 : " + ((1000 * direktor_lambda) / 1000).toFixed(3) + "  ( min.: 0.001 , max.: 0.04 )\n";
    result = result + " D/lambda                 : " + ((1000 * boom_dicke_lambda) / 1000).toFixed(3) + "  ( min.: 0.002 , max.: 0.04 )\n";

    let dl = direktor_lambda;
    let laenge_lambda = (elements - 1) * 0.2;

    // -------------------------------------------------------------------------
    // Gain by David VK3AUU
    let g1 = 3.39 * Math.log(laenge_lambda) + 9.15;
    // Gain by Ring WA2PHW
    let g2 = 10 * Math.log(5.4075 * laenge_lambda + 4.25) / Math.log(10);
    // Gain by Rainer Bertelsmaier DBJ9BV
    let g3 = 7.773 * Math.log(laenge_lambda) / Math.log(10) + 9.28;

    let gain = (g1 + g2 + g3) / 3;
    // -------------------------------------------------------------------------

    result = result + " Boom length              : " + ((elements - 1) * 0.2 * lambda).toFixed(0) + "  mm\n";
    result = result + " Boom diameter            : " + boom.toFixed(1) + "  mm\n";
    result = result + " Parasitic diameter       : " + parasitic.toFixed(1) + "  mm\n";
    result = result + " Elements                 : " + elements + "\n";
    result = result + " Gain                     : " + ((10 * gain) / 10).toFixed(1) + "  dB (approx.)\n";
    result = result + "-------------------------------------------------------------\n";

    abstand[0] = 0;
    dimension[0] = lambda * (0.4593 - 0.005 * Math.log(dl));   // REFLECTOR
    result = result + " Reflector Length      -1 : " + format(dimension[0], 4) + "  mm\n";
    result = result + " Reflector Position       : " + format(abstand[0], 4) + "  mm (+0)\n";

    abstand[1] = 0.2 * lambda;
    dimension[1] = 0.482 * lambda;   // DIPOLE
    result = result + "-------------------------------------------------------------\n";
    result = result + " Dipole Length (Driven) 0 : " + format(dimension[1], 4) + "  mm\n";
    result = result + " Dipole Position          : " + format(abstand[1], 4) + "  mm (+" + abstand[1].toFixed(0) + ")\n";

    j = 1;
    elements = elements - 2;

    while (elements > 0) {
        j++;
        abstand[j] = 0.2 * j * lambda;
        dimension[j] = lambda * (-44674 * dl * dl * dl * dl + 2008.3 * dl * dl * dl + 23.178 * dl * dl - 3.1463 * dl + 0.4675)   // DIRECTOR
        dimension[j] = dimension[j] + lambda * (0.5 * boom_dicke_lambda + 0.002) // KORREKTUR AUFGRUND D/Lambda
        result = result + "-------------------------------------------------------------\n";
        result = result + " Director Length       " + format(j, 2) + " : " + format(dimension[j], 4) + "  mm\n";
        result = result + " Director Position        : " + format(abstand[j], 4) + "  mm (+" + (abstand[j] - abstand[j - 1]).toFixed(0) + ")\n";
        elements = elements - 1;
    }

    result = result + "-------------------------------------------------------------\n";
    result = result + " Calculations based on NBS TECHNICAL NOTE 688\n";
    result = result + " Length might be slightly too long.\n";
    result = result + " Manufacturing Tolerances : < " + (0.002 * lambda).toFixed(0) + "  mm\n";

    result = result + "-------------------------------------------------------------\n";
    const r = 0.1 / 3.141592653;
    const vf = 0.9209525;
    let total_length = lambda * vf;
    result = result + " Folded Dipole            :\n";
    result = result + " Lenght A                 : " + (total_length * 0.19).toFixed(2) + "  mm\n";
    result = result + " Lenght B                 : " + (total_length * 0.10).toFixed(2) + "  mm\n";
    result = result + " Lenght C                 : " + (total_length * 0.40).toFixed(2) + "  mm\n";
    result = result + " Lenght D                 : " + (total_length * 0.20).toFixed(2) + "  mm\n";
    result = result + " Lenght E                 : " + (total_length * r * 2).toFixed(2) + "  mm\n";
    result = result + " Lenght Gap               : " + (total_length * 0.01).toFixed(2) + "  mm\n";
    result = result + " Radius R                 : " + (total_length * r).toFixed(2) + "  mm\n";
    result = result + " Rod Diameter             : " + (lambda / 300).toFixed(2) + "  mm\n";
    result = result + " Total Length             : " + (total_length).toFixed(2) + "  mm\n";

    // https://www.nonstopsystems.com/radio/frank_radio_antenna_folded_dipole.htm
    result = result + "-------------------------------------------------------------\n";

    return result;
}

console.log(rechnen());