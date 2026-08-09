import codecs
with codecs.open('scratch/lint_output.txt', 'r', 'utf-16le') as fi:
    text = fi.read().replace('\ufeff', '')
with codecs.open('scratch/lint_output_utf8.txt', 'w', 'utf-8') as fo:
    fo.write(text)
