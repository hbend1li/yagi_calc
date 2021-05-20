# Yagi Uda Antenna Calculator with Folded Dipole
## constant spacing of 0.2 λ .:. max. length is 5 λ

![ f](res/yagi.png)

### Yagi Uda Antenna
**Note :** It is quite possible, that other calculators deliver slightly different results. Some completely hide their algorithms. We use an interpolation approach. Our results are optimised for gain, but others may be optimised for bandwidth, ... However, if the parasitics differ much from 0.4 ±0.05 * λ or the gain is larger than 16 dBd you should get distrustful.

![alt](res/dipole_folded.png)

### Folded Dipole
The impedance of this antenna is around 300 Ω, so you may want to use a transformer or a λ/4 long piece of 120 Ω coaxial cable to match this impedance to 50 Ω. Geometriy is not that critical. If you want to put this thing outdoors, do not use brass, as it gets brittle.

### Parameter
```js
var antenna = {
    freq:2450,                          // in [MHz]
    elements:3,                         // 3..22 elements
    diameter_of_parasitic_elements:10,  // in [mm]
    diameter_of_boom:20,                // in [mm]
};
```

### Run yagi.js
```bash
$ nodejs yagi.js

**** YAGI UDA ANTENNA ***************************************
 Design by www.changpuak.ch
 https://www.changpuak.ch/electronics/yagi_uda_antenna.php
 Javascript Version 10.11.2020.
 Modified by Hamza BENDALI BRAHAM
************************************************************

-------------------------------------------------------------
 Frequency                : 2450  MHz
 Wavelength               : 122.449  mm
 d/lambda                 : 0.04  ( min.: 0.001 , max.: 0.04 )
 D/lambda                 : 0.04  ( min.: 0.002 , max.: 0.04 )
 Boomlength               : 49  mm
 Elements                 : 3
 Gain                     : 6.8  dB (approx.)
-------------------------------------------------------------
 Reflector Length         : 58  mm
 Reflector Position       : 0  mm
-------------------------------------------------------------
 Dipole Length            : 59  mm
 Dipole Position          : 24  mm
-------------------------------------------------------------
 Director Length          : 51  mm
 Director Position        : 49  mm
-------------------------------------------------------------
 Calculations based on NBS TECHNICAL NOTE 688
 Length might be slightly too long.
 Manufacturing Tolerances : < 0  mm
-------------------------------------------------------------
 Folded Dipole            : res/dipole_folded.png
 Lenght A                 : 21.43  mm
 Lenght B                 : 11.28  mm
 Lenght C                 : 45.11  mm
 Lenght D                 : 22.55  mm
 Lenght Gap               : 1.13  mm
 Radius R                 : 3.59  mm
 Rod Diameter             : 0.41  mm
 Total Length             : 112.77  mm
-------------------------------------------------------------
```


## Ref
- [Yagi Uda Antenna](https://www.changpuak.ch/electronics/yagi_uda_antenna.php)  
- [Folded dipole](https://www.changpuak.ch/electronics/Dipole_folded.php)  
- [Folded dipole](https://www.nonstopsystems.com/radio/frank_radio_antenna_folded_dipole.htm)  