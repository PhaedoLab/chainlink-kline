with open('test.csv') as fout:
  tamount, tmint = 0, 0
  for line in fout:
    items = line.strip().split('|')
    amount, mint = items[3].strip(), items[4].strip()
    if mint == '1':
      print('1', amount, mint)
      tamount += int(amount)
    else:
      print('0', amount, mint)
      tamount -= int(amount)
    
  print(tamount)
