import numpy as np

x = np.arange(1, 101)
y = 2 * x + np.random.randn(100)*2
for index, i in enumerate(x):
    print(i, y[index])