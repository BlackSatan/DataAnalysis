import numpy as np


def parse_file(data):
    result = [[] for i in data[0]]
    for item in data:
        for subindex, subitem in enumerate(item):
            result[subindex].append(float(subitem))
    return np.array(result)


def center_data(data):
    centred = [i - i.mean() for i in data]
    return np.vstack(tuple(centred))


def max_n(array, n):
    new_array = sorted(array, reverse=True)
    new_array = new_array[:n]
    old_links = []
    for index, i in enumerate(list(new_array)):
        for iindex, ii in enumerate(array):
            if ii == i and iindex not in old_links:
                old_links.append(iindex)
                break
    return old_links, new_array


def calculate_components_number(eig_vect, threshold):
    n = 0
    elements = []
    current_threshold = 0
    while current_threshold < threshold:
        n += 1
        thresholds = np.array([sum(i[:n] ** 2) for i in eig_vect])
        elements, current_thresholds = max_n(list(thresholds), n)
        current_threshold = min(current_thresholds)
    elements.sort()
    return elements, n


def row_mean(features):
    return [i.mean() for i in features]


def restore_features(new_features, selected_vecs, mean):
    restored_centred_features = np.dot(new_features.T, selected_vecs).T
    return np.array([restored_centred_features[index] + i for index, i in enumerate(mean)])


def work(file_data, threshold):
    features = parse_file(file_data)
    centred_features = center_data(features)

    covmat = np.cov(centred_features)
    eigenvalues, vecs = np.linalg.eig(covmat)
    old_components_principal, components_number = calculate_components_number(vecs, threshold)
    selected_vecs = []
    for i in old_components_principal:
        selected_vecs.append(vecs[i])
    selected_vecs = np.array(selected_vecs)
    new_features = np.dot(selected_vecs, centred_features)
    restored_features = restore_features(new_features, selected_vecs, row_mean(features))
    result = {
        'components_number': components_number,
        'old_components_principal': old_components_principal,
        'old_features': features,
        'centred_features': centred_features,
        'new_features': new_features,
        'covmat': covmat,
        'restored_features': restored_features,
        'eigenvalues': eigenvalues,
        'eigenvectors': vecs,
    }
    print(result)
    return result
    # Xnew = np.dot(v, Xcentered)
    # print(Xnew)
    #
    # n = 9     #номер элемента случайной величины
    # Xrestored = np.dot(Xnew[n],v) + m
    # print('Restored: ', Xrestored)
    # print('Original: ', x[n])
    # return {
    #     'original': x_o,
    #     'covmat': covmat,
    #     'transformed': [Xnew, y],
    #     'mean': m
    # }
#
# test = [
#     ["1", "2"],
#     ["2", "3"],
#     ["3", "4"],
# ]
# data = work(test, .8)
# print('restored_features', data['restored_features'])