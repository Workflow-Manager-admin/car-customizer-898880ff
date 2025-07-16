#!/bin/bash
cd /home/kavia/workspace/code-generation/car-customizer-898880ff/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

