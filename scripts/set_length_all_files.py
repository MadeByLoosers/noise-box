# -*- coding: utf-8 -*-
from mutagen.easyid3 import EasyID3
from mutagen.id3 import ID3, TIT2
from mutagen.mp3 import MP3
import datetime
import math
import os


def set_length_all_files(path):
    for root, dirs, files in os.walk(path, topdown=False):
        for name in files:
            file_path = os.path.join(root, name)
            fileExtension = os.path.splitext(file_path)[1]
            if fileExtension == '.mp3':
                set_id3_length(file_path)


def format_length(length):
    # Round up so we don't have tracks with 0 seconds
    length = int(math.ceil(length))
    # format the length hh:mm:ss
    if length >= 60:
        length = str(datetime.timedelta(seconds=length))
        # format time further
        if length[0:3] == '0:0':
            length = length[3:]
        elif length[0:2] == '0:':
            length = length[2:]
    return length


def set_id3_length(file_path):
    audio = MP3(file_path)
    # except:
    #     print 'MP3 error %s' % file_path
    length = format_length(audio.info.length)

    # Exception will be thrown if tags don't exist
    try:
        audio_id3 = EasyID3(file_path)
    except Exception as e:
        # Create ID3 tags
        print 'EXCEPTION %s %s' % (file_path, e)
        tags = ID3()
        # below line is needed for tags to be created
        tags['TIT2'] = TIT2(encoding=3, text='')
        tags.save(file_path)
        audio_id3 = EasyID3(file_path)

    audio_id3['length'] = str(length)
    # title is filename (remove .mp3 remove underscores)
    dir, file = os.path.split(file_path)
    file = os.path.splitext(file)[0]
    audio_id3['title'] = file.replace('_', ' ').replace('-', ' ')
    # album is folder name
    album = os.path.split(dir)[1]
    audio_id3['album'] = album.replace('_', ' ').replace('-', ' ')
    # remove artist
    audio_id3['artist'] = ''
    # remove genre
    audio_id3['genre'] = ''
    audio_id3.save()
    #print audio_id3

#set_id3_length('/Users/pxg/Sites/noisebox/src/public/sfx/_misc/hand_with_underscores.mp3')
#set_length_all_files('/Users/pxg/Sites/noisebox/src/public/sfx/_misc/')
set_length_all_files('/Users/pxg/Sites/noisebox/src/public/sfx/')
