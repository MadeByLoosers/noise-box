from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
import pprint

pp = pprint.PrettyPrinter(indent=4)
audio = MP3("beast/2.mp3")
pp.pprint(EasyID3.valid_keys.keys())
pp.pprint(audio)
