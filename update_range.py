#!/usr/bin/env python3
"""
Simple script to update ranges.json
Run manually or via cron after getting ranges from TradingView
"""

import json
import sys
from datetime import datetime

def update_range(symbol, range_value):
    # Load existing data
    try:
        with open('ranges.json', 'r') as f:
            data = json.load(f)
    except:
        data = {}
    
    # Update
    data[symbol] = {
        'range': float(range_value),
        'updated': datetime.utcnow().isoformat() + 'Z'
    }
    
    # Save
    with open('ranges.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Updated {symbol}: {range_value}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python update_range.py SYMBOL RANGE")
        print("Example: python update_range.py MNQ 125.50")
        sys.exit(1)
    
    update_range(sys.argv[1], sys.argv[2])