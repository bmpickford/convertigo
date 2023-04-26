#!/bin/bash

while read -r line; do
  curl -X POST --header "Content-Type: application/json" 0.0.0.0:9000/event -d "$line"
done < "data.jsonl"
