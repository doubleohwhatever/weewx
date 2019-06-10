# griffinparkweather.com weewx files

Griffinparkweather.com uses a Vaisala WXT536 and a Lufft WS10. The WXT536 is the primary sensor suite with the Lufft WS10 providing a few additional sensors. The lufft WS10 generally is not a very good multi-sensor weather station. Most sensors (wind, temp, precip) have unnacceptable accuracy ranges. However, the "precipitation type", luminosity, and solar radiation sensors are surprisingly accurate. Originally I had a CMP3 attached to the WXT536 providing solar radiation data and the WS10 solar radiation sensor stayed within 5% of the CMP3. That's good enough for my needs and and means one less device to maintain. The UV sensor on the WS10 that I have reports the uv index at 50% of the correct value. I've been told this is a firmware issue that will be resolved. For now I'm just multiplying the reported value x2.

All rights and credit goes to original authors:

## Lufft Python Library
https://github.com/Tasm-Devil/lufft-python

## weeWX WX5x0 Driver
https://github.com/matthewwall/weewx-wxt5x0

## NeoWX Theme
https://github.com/neoground/neowx
