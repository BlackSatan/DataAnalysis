import numpy as np
import matplotlib.pyplot as plt
import math


def moving_average(series, n):
    return np.average(series[-n:])


def weighted_average(series, x, n):
    return 2 / (n * (n + 1)) * sum([(n - i) * series[x - i] for i in range(n)])


def exp_average(series, x, n, alpha):
    if n == 0:
        return series[x]
    return alpha * series[x] + (1 - alpha) * exp_average(series, x - 1, n - 1, alpha)


def dma_average(series, x, n, alpha):
    if n == 0:
        return series[x]
    return alpha * exp_average(series, x, n, alpha) + (1 - alpha) * dma_average(series, x - 1, n - 1, alpha)


def tma_average(series, x, n, alpha):
    if n == 0:
        return series[x]
    return alpha * dma_average(series, x, n - 1, alpha) + (1 - alpha) * tma_average(series, x - 1, n - 1, alpha)


def polinomial_rolling(series, n):
    return [
        sum(map(lambda power: x ** power, range(1, n)))
        for i, x in enumerate(series)
    ]


def median_rolling(series, n):
    return [
        x if i < n or i + 1 + n > len(series)
        else np.median(series[i - n:i + n])
        for i, x in enumerate(series)
    ]


def sma_rolling(series, n):
    return [x if i <= n else np.mean(series[i - n:i]) for i, x in enumerate(series)]


def wma_rolling(series, n):
    return [x if i <= n else weighted_average(series, i, n) for i, x in enumerate(series)]


def exp_rolling(series, n):
    alpha = 2 / (n + 1)
    return [x if i <= n else exp_average(series, i, n, alpha) for i, x in enumerate(series)]


def dma_rolling(series, n):
    alpha = 2 / (n + 1)
    return [x if i <= n else dma_average(series, i, n, alpha) for i, x in enumerate(series)]


def tma_rolling(series, n):
    alpha = 2 / (n + 1)
    return [x if i <= n else tma_average(series, i, n, alpha) for i, x in enumerate(series)]


def rolling(series, window):
    k = math.floor(window / 2)
    return [
        sum(series[i-k:i+k])/(1 / (2 * k + 1))
        for i, x in enumerate(series)
    ]


def auto_corr(x):
    """
    Compute the autocorrelation of the signal, based on the properties of the
    power spectral density of the signal.
    """
    x = np.array(x)
    xp = x - np.mean(x)
    f = np.fft.fft(xp)
    p = np.array([np.real(v) ** 2 + np.imag(v) ** 2 for v in f])
    pi = np.fft.ifft(p)
    return np.real(pi)[:math.floor(x.size / 2)] / np.sum(xp ** 2)


def irvin_abnormal_filter(series, critical):
    mean_value = np.mean(series)
    std_deviation = math.sqrt(sum(map(lambda x: (x - mean_value) ** 2, series)) / (len(series) - 1))
    abnormal_stats = [
        0 if i == 0 or i + 1 == len(series) else abs(x - series[i - 1]) / std_deviation
        for i, x in enumerate(series)
    ]
    filtred_series = list(series)
    for i, x in enumerate(abnormal_stats):
        if x > critical:
            filtred_series[i] = (filtred_series[i - 1] + filtred_series[i + 1]) / 2
    return filtred_series


def mann_whitney_criteria(series):
    minimal = min(series)
    maximal = max(series)
    count = len(series)
    length = (maximal - minimal) / count
    ranges = [*map(
        lambda x: int((x - minimal) / length),
        series
    )]
    print(count, ranges)
    n1 = len(series[int(len(series) / 2):])
    n2 = len(series[:int(len(series) / 2)])
    u = sum(ranges[int(len(ranges) / 2):]) - n1 * (n1 + 1) / 2
    return (u - n1 * n2 / 2) / math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12)


def median_series_criteria(series):
    minimal = min(series)
    maximal = max(series)
    count = len(series)
    length = (maximal - minimal) / count
    ranges = [*map(
        lambda x: int((x - minimal) / length),
        series
    )]
    range_series = [-1 if ranges[i + 1 if i+2 <= len(ranges) else i] - r < 0 else 1 for i, r in enumerate(ranges)]
    series_count = 0
    longest = 0
    current = 0
    last = None
    for item in range_series:
        if last == item:
            current += 1
        else:
            series_count += 1
            current = 1
        longest = max(current, longest)
        last = item
    significance_criteria = 1.96
    longest_q = 3.3 * (math.log(count) + 1)
    series_count_q = .5 * (count + 1 - significance_criteria * math.sqrt(count - 1))
    return {
        'longest': longest,
        'series_count': series_count,
        'longest_q': longest_q,
        'series_count_q': series_count_q,
    }


def up_down_series_criteria(series):
    minimal = min(series)
    maximal = max(series)
    count = len(series)
    length = (maximal - minimal) / count
    ranges = [*map(
        lambda x: int((x - minimal) / length),
        series
    )]
    m = np.median(ranges)
    range_series = list(map(lambda x: -1 if x - m < 0 else 1, ranges))
    print('ranges', ranges)
    print('m', m)
    print('range_series', range_series)
    series_count = 0
    longest = 0
    current = 0
    last = None
    for item in range_series:
        if last == item:
            current += 1
        else:
            series_count += 1
            current = 1
        longest = max(current, longest)
        last = item
    significance_criteria = 1.96
    longest_q = (1 / 3) * (2 * count - 1) - significance_criteria * math.sqrt((16 * count - 29) / 90)
    return {
        'longest': longest,
        'series_count': series_count,
        'longest_q': longest_q,
        'series_count_q': 7,
    }


def get_data(inputs):
    float_inputs = list(map(lambda x: float(x), inputs))
    return {
        'data': float_inputs,
        'abnormal': irvin_abnormal_filter(float_inputs, 1.5),
        'auto_corr': auto_corr(float_inputs),
        'mann_whitney': {
            'criteria': mann_whitney_criteria(irvin_abnormal_filter(float_inputs, 1.5))
        },
        'median_series': median_series_criteria(float_inputs),
        'up_down_series': up_down_series_criteria(float_inputs),
    }


def get_rolling(inputs, n):
    float_inputs = list(map(lambda x: float(x), inputs))
    return {
        'median': median_rolling(float_inputs, n),
        'sma': sma_rolling(float_inputs, n),
        'wma': wma_rolling(float_inputs, n),
        'ema': exp_rolling(float_inputs, n),
        'dma': dma_rolling(float_inputs, n),
        'tma': tma_rolling(float_inputs, n)
    }


sample = [40.6,40.8,44.4,46.7,54.1,58.5,57.7,56.4,54.3,50.5,42.9,39.8,44.2,39.8,95.1,47,54.1,58.7,66.3,59.9,57,54.2,39.7,42.8,37.5,38.7,39.5,42.1,55.7,57.8,56.8,54.3,54.3,47.1,41.8,41.7,41.8,40.1,42.9,45.8,49.2,52.7,64.2,59.6,54.4,49.2,36.6,37.6,39.3,37.5,38.3,45.5,53.2,57.7,60.8,58.2,56.4,49.8,44.4,43.6,40,40.5,40.8,45.1,53.8,59.4,63.5,61,53,50,38.1,36.3,39.2,43.4,43.4,48.9,50.6,56.8,62.5,62,57.5,46.7,41.6,39.8,39.4,38.5,45.3,47.1,51.7,55,60.4,60.5,54.7,50.3,42.3,35.2,40.8,41.1,42.8,47.3,50.9,56.4,62.2,60.5,55.4,50.2,43,37.3,34.8,31.3,41,43.9,53.1,56.9,62.5,60.3,59.8,49.2,42.9,41.9,41.6,37.1,41.2,46.9,51.2,60.4,60.1,61.6,57,50.9,43,38.8,37.1,38.4,38.4,46.5,53.5,58.4,60.6,58.2,53.8,46.6,45.5,40.6,42.4,38.4,40.3,44.6,50.9,57,62.1,63.5,56.2,47.3,43.6,41.8,36.2,39.3,44.5,48.7,54.2,60.8,65.5,64.9,60.1,50.2,42.1,35.6,39.4,38.2,40.4,46.9,53.4,59.6,66.5,60.4,59.2,51.2,42.8,45.8,40.4,42.6,43.5,47.1,50,60.5,64.6,64,56.8,48.6,44.2,36.4,37.3,35,44,43.9,52.7,58.6,60,61.1,58.1,49.6,41.6,41.3,40.8,41,38.4,47.4,54.1,58.6,61.4,61.8,56.3,50.9,41.4,37.1,42.1,41.2,47.3,46.6,52.4,59,59.6,60.4,57,50.7,47.8,39.2,39.4,40.9,42.4,47.8,52.4,58,60.7,61.8,58.2,46.7,46.6,37.8]
# sample = list(reversed(sample))
print(median_rolling(sample, 12))
# r = irvin_abnormal_filter(sample, 1.5)
# #plt.plot(sample)
# plt.plot(rolling(sample, 12))
# plt.ylabel('sample')
# plt.show()
