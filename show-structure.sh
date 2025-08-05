#!/bin/bash

# Show project folder structure (excluding node_modules and .git)
echo "Project folder structure:"
tree -I 'node_modules|.git' -a
echo "\nPostman collections:"
ls -1 postman 2>/dev/null || echo "(No postman directory found)"
