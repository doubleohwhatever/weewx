#!/usr/bin/python
#
#[LufftDriver]
#    poll_interval = 0
#    path = /root/WS_UMB_SIMPLE_SINGLE.py
#    driver = user.lufftdriver
#
#[Station]
#    station_type = LufftDriver
#
#https://github.com/Tasm-Devil/lufft-python
#
#sudo /etc/init.d/weewx stop
#sudo /etc/init.d/weewx start

from __future__ import with_statement
import syslog
import time
import subprocess
import weewx
import weewx.drivers
import weeutil.weeutil
from weewx.engine import StdService
import weewx.units
import weewx.wxformulas
import schemas.wview

lufft_schema = schemas.wview.schema + [('luminosity', 'REAL')] + [('precipitationType', 'REAL')] + [('rain2', 'REAL')] + [('rainRate2', 'REAL')]

# set up appropriate units
weewx.units.USUnits['group_luminosity'] = 'klux'
weewx.units.MetricUnits['group_luminosity'] = 'klux'
weewx.units.MetricWXUnits['group_luminosity'] = 'klux'
weewx.units.default_unit_format_dict['klux'] = '%.1f'
weewx.units.default_unit_label_dict['klux']  = ' klux'
weewx.units.obs_group_dict['luminosity'] = 'group_luminosity'

weewx.units.USUnits['group_precipitation_type'] = 'precipitation_type'
weewx.units.MetricUnits['group_precipitation_type'] = 'precipitation_type'
weewx.units.MetricWXUnits['group_precipitation_type'] = 'precipitation_type'
weewx.units.default_unit_format_dict['precipitation_type'] = '%.1f'
weewx.units.default_unit_label_dict['precipitation_type']  = ' type'
weewx.units.obs_group_dict['precipitationType'] = 'group_precipitation_type'

weewx.units.obs_group_dict['rain2'] = 'group_rain'
weewx.units.obs_group_dict['rainRate2'] = 'group_rainrate'

DRIVER_NAME = 'LufftDriver'
DRIVER_VERSION = "0.1"

def logmsg(dst, msg):
    syslog.syslog(dst, 'lufftdriver: %s' % msg)

def logdbg(msg):
    logmsg(syslog.LOG_DEBUG, msg)

def loginf(msg):
    logmsg(syslog.LOG_INFO, msg)

def logerr(msg):
    logmsg(syslog.LOG_ERR, msg)

def _get_as_float(d, s):
    v = None
    if s in d:
        try:
            v = float(d[s])
        except ValueError as e:
            logerr("cannot read value for '%s': %s" % (s, e))
    return v

def loader(config_dict, engine):
    return LufftDriver(**config_dict[DRIVER_NAME])

class LufftDriver(weewx.drivers.AbstractDevice):
    """Really bad and hacked together lufft driver"""

    def __init__(self, **stn_dict):
        # where to find the data file
        self.path = stn_dict.get('path', '/root/WS_UMB_SIMPLE_SINGLE.py')
        # how often to poll the weather data file, seconds
        self.poll_interval = float(stn_dict.get('poll_interval', 0))
        self.last_rain_check = 0
        self.last_rain_rate_check = 0
        # mapping from variable names to weewx names

        loginf("lufft interface file is at %s" % self.path)
        loginf("polling interval is %s" % self.poll_interval)

    def genLoopPackets(self):
        while True:
            try:
                packet = dict()
                packet['usUnits'] = weewx.US
                packet['dateTime'] = int(time.time() + 0.5)
                #packet['VARIABLE'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','DEVICE_ID','CLASS','CHANNEL']).rstrip())
                try:
                    #packet['supplyVoltage'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','10000']).rstrip()) #1 7 10000 (volts act) - From Lufft WS500
                    packet['supplyVoltage'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','10000']).rstrip()) #2 7 10000 (volts act) - From Lufft WS10
                except:
                    pass
                #try:
                #    packet['heatingTemp'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','117']).rstrip()) #1 7 117 (F act) - From Lufft WS500
                #except:
                #    pass
                try:
                    #packet['outTemp'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','105']).rstrip()) #1 7 105 (F act) - From Lufft WS500
                    packet['outTemp'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','105']).rstrip()) #2 7 105 (F act) - From Lufft WS10
                except:
                    pass
                try:
                    #packet['dewpoint'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','115']).rstrip()) #1 7 115 (F act) - From Lufft WS500
                    packet['dewpoint'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','115']).rstrip()) #2 7 115 (F act) - From Lufft WS10
                except:
                    pass
                #try:
                #    packet['windchill'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','116']).rstrip()) #1 7 116 (F act) - From Lufft WS500 !!!disabling hardware windchill due to odd values being received from WS500!!!
                #except:
                #    pass
                try:
                    #packet['outHumidity'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','200']).rstrip()) #1 7 200 (rel hum %) - From Lufft WS500
                    packet['outHumidity'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','200']).rstrip()) #2 7 200 (rel hum %) - From Lufft WS10
                except:
                    pass
                try:
                    #packet['pressure'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','300']).rstrip()) #1 7 300 (act abs hpa) - From Lufft WS500 !!!make things easier for weewx and just covert to inhg here!!!
                    #packet['pressure'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','300']).rstrip()) / 33.86 #1 7 300 (act abs inhg) - From Lufft WS500
                    packet['pressure'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','300']).rstrip()) / 33.86 #2 7 300 (act abs inhg) - From Lufft WS10
                except:
                    pass
                try:
                    #packet['windSpeed'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','410']).rstrip()) #1 7 410 (mph act) - From Lufft WS500
                    packet['windSpeed'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','410']).rstrip()) #2 7 410 (mph act) - From Lufft WS10
                except:
                    pass
                try:
                    #packet['windDir'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','500']).rstrip()) #1 7 500 (deg act) - From Lufft WS500
                    packet['windDir'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','500']).rstrip()) #2 7 500 (deg act) - From Lufft WS10
                except:
                    pass
                #try:
                #    packet['windGust'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','450']).rstrip()) #1 7 450 (mph max) - From Lufft WS500
                #except:
                #    pass
                #try:
                #    packet['windGustDir'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','7','540']).rstrip()) #1 7 540 (deg max) - From Lufft WS500
                #except:
                #    pass
                try:
                    packet['radiation'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','900']).rstrip()) #2 7 900 (W/m2 act) - From Lufft WS10
                except:
                    pass
                try:
                    packet['UV'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','902']).rstrip()) #2 7 902 (UV act) - From Lufft WS10
                except:
                    pass
                try:
                    packet['luminosity'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','903']).rstrip()) #2 7 903 (klx act) - From Lufft WS10
                except:
                    pass
                try:
                    packet['precipitationType'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','700']).rstrip()) #2 7 700 (type act) - From Lufft WS10
                except:
                    pass
                #only check rain rate every 30 seconds - For some reason both Lufft R2S and WS10 produce errors when reading rain accum data and rain rate data with short intervals
                if self.last_rain_rate_check < time.time():
                    try:
                        #packet['rainRate'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','2','1153']).rstrip()) #1 2 1153 (inch/hr) - From Lufft R2S
                        packet['rainRate'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','840']).rstrip()) #2 7 1153 (inch/hr) - From Lufft WS10
                        self.last_rain_rate_check = time.time() + 30
                        logerr("Successfully read rain rate data")
                    except:
                        #logerr("Failed to read rain rate data")
                        pass
                #only check rain every 120 seconds - For some reason both Lufft R2S and WS10 produce errors when reading rain accum data and rain rate data with short intervals
                if self.last_rain_check < time.time():
                    try:
                        #packet['rain'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','1','2','621']).rstrip()) #1 2 621 (rain since last request in inch) - From Lufft R2S
                        packet['rain'] = float(subprocess.check_output(['/root/WS_UMB_SIMPLE_SINGLE.py','2','7','645']).rstrip()) #2 7 645 (rain since last request in inch) - From Lufft WS10
                        self.last_rain_check = time.time() + 135
                        logerr("Successfully read rain data")
                    except:
                        #logerr("Failed to read rain data")
                        pass
                yield packet
                time.sleep(self.poll_interval)
            except:
                logerr("LOOP packet generation failed")

    @property
    def hardware_name(self):
        return "Lufft WS10/WS500/WTB100" #Change this to match whatever mix of Lufft hardware you have

# To test this driver, run it directly as follows:
#PYTHONPATH=/usr/share/weewx python /usr/share/weewx/user/lufftdriver.py
if __name__ == "__main__":
    import weeutil.weeutil
    driver = LufftDriver()
    for packet in driver.genLoopPackets():
        print weeutil.weeutil.timestamp_to_string(packet['dateTime']), packet
