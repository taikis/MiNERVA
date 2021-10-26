import shutil
import os
import qrcode
import subprocess
import glob
import re

def remove_glob_re(pattern, pathname, recursive=True):
    for p in glob.glob(pathname, recursive=recursive):
        if os.path.isfile(p) and re.search(pattern, p):
            os.remove(p)

def create_tex(reference_number: str, step: int):
    tex_path_old = os.path.dirname(__file__)+ '/latex/base.tex'
    tex_path_new = os.path.dirname(__file__) + '/latex/' + str(step) + '.tex'
    with open(tex_path_old, encoding="utf8") as f:
        data_lines = f.read()

    # 文字列置換
    data_lines = data_lines.replace("%num", reference_number)

    # 同じファイル名で保存
    with open(tex_path_new, mode="w", encoding="utf8") as f:
        f.write(data_lines)

def create_qr(reference_number: str):
    url = 'https://minerva.hosei-u.com/form/?number=' + reference_number
    img = qrcode.make(url)
    img.save(os.path.dirname(__file__)+ '/qr/qr.png')

def create_pdf(step: int):
    file_name = os.path.dirname(__file__)+ '/latex/' + str(step) + ".tex"
    cmd = ["ptex2pdf","-l", "-ot", "-kanji=utf8 -synctex=1", file_name]
    subprocess.run(cmd,cwd=os.path.dirname(__file__)+ '/latex/')
    remove_glob_re(".*\.(aux|log|synctex\.gz)",os.path.dirname(__file__)+ '/latex/**')


reference_number:int = 1
while(reference_number < 25):
    for step in range(8):
        reference_number_str =str(reference_number).zfill(6)
        create_tex(reference_number_str, step)
        create_qr(reference_number_str)
        create_pdf(step)
        reference_number += 1

    cmd = ['pdfjam']
    for step in range(8):
        cmd.append(str(step) + '.pdf')
    cmd = cmd + ['--nup' ,'4x2' ,'--paper','a4paper','--landscape', '--outfile' ,os.path.dirname(__file__)+ '/latex/join.pdf']
    subprocess.run(cmd,cwd=os.path.dirname(__file__)+ '/latex/')
    # '--paper','a4paper', '--orient', 'landscape' , '--fitpaper', 'false',
    cmd = ['pdfjam','--suffix', 'rotated90', '--angle' ,'90', '--scale', '0.96','--fitpaper' ,'true' ,os.path.dirname(__file__)+ '/latex/join.pdf']

    subprocess.run(cmd,cwd=os.path.dirname(__file__)+ '/latex/')

    cmd = ['lpr','-P','OKI_C824_B17B35','-o','fit-to-page' ,os.path.dirname(__file__)+ '/latex/join-rotated90.pdf']

    subprocess.run(cmd,cwd=os.path.dirname(__file__)+ '/latex/')