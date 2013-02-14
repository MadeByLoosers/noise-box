from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3


def set_id3_length(file_path):
    audio = MP3(file_path)
    length = audio.info.length
    audio_id3 = EasyID3(file_path)
    audio_id3["length"] = str(int(length))
    audio_id3.save()

set_id3_length('/Users/pxg/Sites/noisebox/src/public/sfx/adam-and-joe/pirate-interruptions-chocolate-cake-slice.mp3')
#TODO: round to nearest second
#TODO: can we set the time as minutes:seconds?
