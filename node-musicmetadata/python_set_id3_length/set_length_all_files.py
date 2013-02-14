from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3
import datetime


def set_id3_length(file_path):
    audio = MP3(file_path)
    # get the seconds as a rounded number
    length = int(audio.info.length)
    # format the length
    length = str(datetime.timedelta(seconds=length))
    print length
    #length = "1:00:01"
    #print length

    audio_id3 = EasyID3(file_path)
    audio_id3["length"] = length
    audio_id3.save()

set_id3_length('/Users/pxg/Sites/noisebox/src/public/sfx/adam-and-joe/pirate-interruptions-chocolate-cake-slice.mp3')
