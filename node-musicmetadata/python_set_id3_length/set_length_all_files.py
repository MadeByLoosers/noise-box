from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2
import datetime
import os


def set_length_all_files(path):
    for root, dirs, files in os.walk(path, topdown=False):
        for name in files:
            file_path = os.path.join(root, name)
            set_id3_length(file_path)


def set_id3_length(file_path):
    try:
        #TODO: set title to file (remove .mp3 remove underscores)
        #TODO: album to folder name
        #TODO: remove artist
        #TODO: remove genre
        audio = MP3(file_path)
        # get the seconds as a rounded number
        length = int(audio.info.length)
        # format the length hh:mm:ss
        if length >= 60:
            length = str(datetime.timedelta(seconds=length))
            # format time further
            if length[0:3] == '0:0':
                length = length[3:]
            elif length[0:2] == '0:':
                length = length[2:]

        # Add tags if they don't already exist
        try:
            audio_id3 = EasyID3(file_path)
        except:
            print 'exception'
            tags = ID3()
            tags["TIT2"] = TIT2(encoding=3, text='')
            tags.save(file_path)
            audio_id3 = EasyID3(file_path)

        audio_id3["length"] = str(length)
        audio_id3.save()

    except Exception as e:
        print 'EXCEPTION %s %s' % (file_path, e)

#set_id3_length('/Users/pxg/Sites/noisebox/src/public/sfx/_misc/hand.mp3')
set_length_all_files('/Users/pxg/Sites/noisebox/src/public/sfx/')
