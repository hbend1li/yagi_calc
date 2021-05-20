# Yagi Uda Antenna Calculator with Folded Dipole
## constant spacing of 0.2 λ .:. max. length is 5 λ

### Yagi Uda Antenna
**Note :** It is quite possible, that other calculators deliver slightly different results. Some are based on look-up tables, some completely hide their algorithms. We use an interpolation approach. Our results are optimised for gain, but others may be optimised for bandwidth, ... However, if the parasitics differ much from 0.4 ±0.05 * λ or the gain is larger than 16 dBd you should get distrustful.

![alt](res/dipole_folded.png)

### Folded Dipole
The impedance of this antenna is around 300 Ω, so you may want to use a transformer or a λ/4 long piece of 120 Ω coaxial cable to match this impedance to 50 Ω. Geometriy is not that critical. If you want to put this thing outdoors, do not use brass, as it gets brittle.

### Parameter
```json
var antenna = {
    freq:2450,                          // in [MHz]
    elements:3,                         // 3..22 elements
    diameter_of_parasitic_elements:10,  // in [mm]
    diameter_of_boom:20,                // in [mm]
    boom_isolated_from_parasitics: true // true, false
};
```

### Run yagi.js
```bash
$ nodejs yagi.js

https://www.changpuak.ch/electronics/yagi_uda_antenna.php
Javascript Version 12.01.2014, based on Rothammel / DL6WU
Moded by Hamza BENDALI BRAHAM <hbendali@ya.ru>
-------------------------------------------------------------
 Frequency     :  2450 MHz
 Wavelength    :  122 mm
 Rod Diameter  :  10 mm
 Boom Diameter :  20 mm
 Boom Length   :  59 mm
 d/lambda      :  0.040    ( min.: 0.002 , max.: 0.01 )
 D/lambda      :  0.050    ( min.: 0.01 , max.: 0.05 )
 Elements      :  3
 Gain          :  5.23 dBd (approx.)
-------------------------------------------------------------
 Reflector Length   : 59 mm
 Reflector Position :  0 mm
-------------------------------------------------------------
 Dipole Position    : 29 mm
-------------------------------------------------------------
 Director #1 Position : 39 mm ,  Length : 56 mm
 Distance Dipole - Dir. #1 : 9 mm
-------------------------------------------------------------
 Directors / Parasitics are isolated. 
 Please choose an isolater thicker than : 3.1 mm
-------------------------------------------------------------

- Folded Dipole ---------------------------------------------
 Image URL     :  https://www.changpuak.ch/electronics/images/DIPOLE_folded.png
 Lenght A      :  21.43 mm
 Lenght B      :  11.28 mm
 Lenght C      :  45.11 mm
 Lenght D      :  22.55 mm
 Lenght Gap    :  1.13 mm
 Radius R      :  3.59 mm
 Rod Diameter  :  0.41 mm
 Total Length  :  112.77 mm
-------------------------------------------------------------
```


## Ref
- [Yagi Uda Antenna](https://www.changpuak.ch/electronics/yagi_uda_antenna.php)  
- [Dipole folded](https://www.changpuak.ch/electronics/Dipole_folded.php)  