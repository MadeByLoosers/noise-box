from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3
import datetime
import os


def set_length_all_files(path):
    #print 'loop files here'
    for root, dirs, files in os.walk(path, topdown=False):
        for name in files:
            file_path = os.path.join(root, name)
            set_id3_length(file_path)
        # for name in dirs:
        #     print 'DIR: ' + os.path.join(root, name)


def set_id3_length(file_path):
    audio = MP3(file_path)
    # get the seconds as a rounded number
    length = int(audio.info.length)
    # format the length hh:mm:ss
    length = str(datetime.timedelta(seconds=length))
    # format time further
    if length[0:3] == '0:0':
        length = length[3:]
    elif length[0:2] == '0:':
        length = length[2:]
    #print length

    audio_id3 = EasyID3(file_path)
    audio_id3["length"] = length
    audio_id3.save()

#set_id3_length('/Users/pxg/Sites/noisebox/src/public/sfx/adam-and-joe/pirate-interruptions-chocolate-cake-slice.mp3')
set_length_all_files('/Users/pxg/Sites/noisebox/src/public/sfx/adam-and-joe/')
#set_length_all_files('/Users/pxg/Sites/noisebox/src/public/sfx/')
