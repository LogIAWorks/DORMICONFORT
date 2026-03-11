import sys
from PIL import Image

def process_ticket(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        max_val = max(item[0], item[1], item[2])
        if max_val < 30:
            alpha = int((max_val / 30.0) * 255)
            new_data.append((0, 0, 0, alpha))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

process_ticket(sys.argv[1], sys.argv[2])
print("Done")
