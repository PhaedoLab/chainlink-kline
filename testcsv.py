# import datetime


# ts_items_kv = {}
# with open('test.csv') as fout:
#   tamount, tmint = 0, 0
#   for line in fout:
#     items = line.strip().split('|')
#     amount, mint, ts = items[3].strip(), items[4].strip(), int(items[-2].strip())
#     date = datetime.datetime.fromtimestamp(ts)
#     ts_items_kv[ts] = (amount, mint, ts, date)
    
#   tokens = sorted(ts_items_kv.items(), key=lambda x: x[0])
#   for token in tokens:
#     (amount, mint, ts, date) = token[1]
#     if mint == '1':
#       tamount += int(amount)
#       print('1', amount, mint, date, tamount, ts)
#     else:
#       tamount -= int(amount)
#       print('0', amount, mint, date, tamount, ts)

# from PIL import Image

# def convert_png_to_jpg(png_path, jpg_path):
#     image = Image.open(png_path)
#     image = image.convert("RGB")  # 将图像转换为RGB模式（如果PNG图像有透明通道）
#     image.save(jpg_path, "JPEG")

# convert_png_to_jpg("./input_img.png", "./input_img1.jpeg")
# image = Image.open("./input_img1.jpeg")
# width, height = image.size
# pixels = image.load()


# import ezdxf

# dxf = ezdxf.new(dxfversion="R2010")  # 设置DXF版本
# modelspace = dxf.modelspace()  # 获取模型空间

# for y in range(height):
#     for x in range(width):
#         r, g, b = pixels[x, y]  # 获取像素颜色值
#         point = (x, y)  # 假设使用图像像素坐标作为CAD点的位置
#         modelspace.add_point(point, dxfattribs={"color": ezdxf.rgb2int((r, g, b))})

# dxf.saveas("output.dxf")


# import ezdxf
# import numpy
# import cv2
# import argparse

# ap = argparse.ArgumentParser()
# ap.add_argument("-i", "--input", type=str, default="input_img.png", help="path to input jpg drawing")
# ap.add_argument("-o", "--output", type=str, default="output_dxf.dxf", help="path to output dxf drawing")
# ap.add_argument("-l", "--lower_range", type=str, default="(0,0,0)", help="Lower range in BGR format for the mask")
# ap.add_argument("-u", "--upper_range", type=str, default="(200,200,200)", help="Upper range in BGR format for the mask")

# args = vars(ap.parse_args())

# upper_B, upper_G, upper_R = int(args["upper_range"].replace("(","").replace(")","").split(",")[0]), int(args["upper_range"].replace("(","").replace(")","").split(",")[1]), int(args["upper_range"].replace("(","").replace(")","").split(",")[2])
# lower_B, lower_G, lower_R = int(args["lower_range"].replace("(","").replace(")","").split(",")[0]), int(args["lower_range"].replace("(","").replace(")","").split(",")[1]), int(args["lower_range"].replace("(","").replace(")","").split(",")[2])

# upper_range_tuple = (upper_B,upper_G,upper_R)
# lower_range_tuple = (lower_B,lower_G,lower_R)

# doc = ezdxf.new('R2010')
# msp = doc.modelspace() 
# opened_jpg = cv2.imread(args["input"])
# masked_jpg = cv2.inRange(opened_jpg,lower_range_tuple, upper_range_tuple)
# print(masked_jpg.shape)

# for i in range(0,masked_jpg.shape[0]):
#     for j in range(0,masked_jpg.shape[1]):
#         if masked_jpg[i][j] == 255:
#             msp.add_line((j,masked_jpg.shape[0] - i), (j,masked_jpg.shape[0] - i))

# doc.saveas('output_dxf.dxf')


# Copyright (c) 2016 Manfred Moitzi
# License: MIT License
# import ezdxf
# import os

# IMAGE_PATH = 'mycat.jpg'
# ABS_IMAGE_PATH = os.path.abspath(IMAGE_PATH)
# dwg = ezdxf.new('R2004')  # image requires the DXF 2000 or newer format
# my_image_def = dwg.add_image_def(filename=ABS_IMAGE_PATH, size_in_pixel=(640, 360))
# # image definition is like a block definition

# msp = dwg.modelspace()
# # add first image, image is like a block reference (INSERT)
# msp.add_image(image_def=my_image_def, insert=(2, 1), size_in_units=(6.4, 3.6), rotation=0)

# # add first image
# msp.add_image(image_def=my_image_def, insert=(4, 5), size_in_units=(3.2, 1.8), rotation=30)

# # rectangular boundaries
# image = msp.add_image(image_def=my_image_def, insert=(10, 1), size_in_units=(6.4, 3.6), rotation=0)
# image.set_boundary_path([(50, 50), (600, 300)])

# # user defined boundary path
# image = msp.add_image(image_def=my_image_def, insert=(10, 5), size_in_units=(6.4, 3.6), rotation=0)
# image.set_boundary_path([(50, 50), (500, 70), (450, 300), (70, 280)])

# # get existing image definitions
# image_defs = dwg.objects.query('IMAGEDEF')  # get all image defs in drawing
# # The IMAGEDEF entity is like a block definition, it just defines the image

# # get existing images
# images = dwg.entities.query('IMAGE')
# # The IMAGE entity is like the INSERT entity, it creates an image reference,
# # and there can be multiple references of the same picture in a drawing.


# dwg.saveas("using_image.dxf")



import ezdxf

# The IMAGE entity requires the DXF R2000 format or later.
doc = ezdxf.new("R2000")

# The IMAGEDEF entity is like a block definition, it just defines the image.
my_image_def = doc.add_image_def(
    filename="mycat.jpg", size_in_pixel=(640, 360)
)


msp = doc.modelspace()
# The IMAGE entity is like the INSERT entity, it's just an image reference,
# and there can be multiple references to the same picture in a DXF document.

# 1st image reference
msp.add_image(
    insert=(2, 1),
    size_in_units=(6.4, 3.6),
    image_def=my_image_def,
    rotation=0
)
# 2nd image reference
msp.add_image(
    insert=(4, 5),
    size_in_units=(3.2, 1.8),
    image_def=my_image_def,
    rotation=30
)

# Get existing image definitions from the OBJECTS section:
image_defs = doc.objects.query("IMAGEDEF")

doc.saveas("dxf_with_cat.dxf")