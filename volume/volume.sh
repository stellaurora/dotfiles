#!/bin/bash
CURRENT_VOL=$(wpctl get-volume @DEFAULT_AUDIO_SINK@)
DIR="$(dirname "$(realpath "$0")")"
MAX_VOL=$(awk "BEGIN {print $(cat $DIR/max-volume)/100}")

if [ $1 -eq 1 ]
then
	wpctl set-volume -l $MAX_VOL @DEFAULT_AUDIO_SINK@ 2%+
else
	wpctl set-volume -l $MAX_VOL @DEFAULT_AUDIO_SINK@ 2%-	
fi

