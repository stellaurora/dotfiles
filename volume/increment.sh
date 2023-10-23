#!/bin/bash
DIR="$(dirname "$(realpath "$0")")"
MAX_VOL="$(cat $DIR/max-volume)"
NEW_VOL="$(($MAX_VOL+$1))"
if [ $NEW_VOL -gt 0 ]
then
	echo $NEW_VOL > $DIR/max-volume

	NEW_MAX_VOL=$(awk "BEGIN {print ($NEW_VOL/100)}")
	wpctl set-volume -l $NEW_MAX_VOL @DEFAULT_AUDIO_SINK@ 0%+
	pkill -RTMIN+8 waybar
fi
