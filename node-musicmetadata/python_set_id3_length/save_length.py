from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
import pprint

file_path = '/Users/pxg/Sites/noisebox/node-musicmetadata/tracks/beast/1.mp3'
pp = pprint.PrettyPrinter(indent=4)
audio = MP3(file_path)
length = audio.info.length

audio2 = EasyID3(file_path)
audio2["length"] = str(length)
audio2.save()
