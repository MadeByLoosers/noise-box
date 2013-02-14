from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
import pprint

pp = pprint.PrettyPrinter(indent=4)
audio = MP3("/Users/pxg/Sites/noisebox/src/public/sfx/_misc/hand.mp3")
pp.pprint(EasyID3.valid_keys.keys())
pp.pprint(audio)
