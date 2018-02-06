class KMean:
    size = 0
    center = []
    points = []

    def __init__(self, center):
        self.center = center

    def addpoint(self, point):
        self.points = self.points + [point]
        self.size += 1

    def delpoint(self, point):
        self.points.remove(point)
        self.size -= 1

    def calccenter(self):
        self.center = [0 for i in range(len(self.points[0]))]
        for j in range(len(self.points[0])):
            for i in range(len(self.points)):
                self.center[j] += self.points[i][j]
            self.center[j] /= self.size
        return self.center


def kmean_initcenters(points, numofclusters):
    centers = []
    for i in range(numofclusters):
        centers += [points[i]]
    return centers


def kmean_clustercenters(centers, points, distance_type):
    clus = [KMean(centers[i]) for i in range(len(centers))]
    for i in range(len(points)):
        distances = ([distance(points[i], clus[j].center, distance_type) for j in range(len(clus))])
        mindistanceindex = distances.index(min(distances))
        clus[mindistanceindex].addpoint(points[i])
    return ([clus[i].calccenter() for i in range(len(clus))])


def k_mean_cluster(centers, points, distance_type):
    clus = [KMean(centers[i]) for i in range(len(centers))]
    for i in range(len(points)):
        distances = ([distance(points[i], clus[j].center, distance_type) for j in range(len(clus))])
        mindistanceindex = distances.index(min(distances))
        clus[mindistanceindex].addpoint(points[i])
    return ([clus[i].points for i in range(len(clus))])


def kmean_clusterize(points, numofclusters, eps, distance_type):
    oldcenters = kmean_initcenters(points, numofclusters)
    centers = oldcenters
    diff = float("Inf")
    while diff > eps:
        oldcenters = centers
        centers = kmean_clustercenters(centers, points, distance_type)
        diff = max([distance(centers[i], oldcenters[i], distance_type) for i in range(len(centers))])
    clusterized = k_mean_cluster(centers, points, distance_type)
    return clusterized


def distance(a, b, type):
    if type == 'e':
        summ = 0
        for i, j in zip(a, b):
            summ += (i - j) ** 2
        return float(summ ** 0.5)
    elif type == 'm':
        summ = 0
        for i, j in zip(a, b):
            summ += abs(i - j)
        return summ
    elif type == 'ch':
        summ = []
        for i, j in zip(a, b):
            summ.append(abs(i - j))
        return max(summ)


def datatopoint(data0, data1):
    points = []
    for i in range(len(data0)):
        points = points + [[data0[i], data1[i]]]
    return points


def pointtodata(points):
    data = [[] for i in range(len(points[0]))]
    for i in range(len(points)):
        for j in range(len(points[0])):
            data[j] = data[j] + [points[i][j]]
    return data


def cp_to_cd(clusterizedpoints):
    data = [[] for i in range(len(clusterizedpoints))]
    for i in range(len(clusterizedpoints)):
        data[i] = pointtodata(clusterizedpoints[i])
    return data


def work(data, x, y, clusters, distance_type):
    points = datatopoint(data[x], data[y])
    eps = 0.05
    clusterized_points = kmean_clusterize(points, clusters, eps, distance_type)
    return {
        'points': points,
        'clusterized': clusterized_points
    }