import heapq
import math


def find(waypoints: list) -> list:
    return waypoints


def calculate_distances(graph, starting_vertex):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[starting_vertex] = 0
    priority_queue = [(0, starting_vertex)]

    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)

        if current_distance > distances[current_vertex]:
            continue

        for neighbor, weight in graph[current_vertex].items():
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))

    return distances


def shortest_path(graph, start, end):
    distances = calculate_distances(graph, start)
    path = []
    current_vertex = end

    while current_vertex != start:
        path.append(current_vertex)
        current_vertex = min(
            (distances[neighbor], neighbor)
            for neighbor in graph[current_vertex]
            if neighbor in distances
        )[1]
    path.append(start)
    return path[::-1]


def euclidean_distance(coord1, coord2):
    return math.sqrt(sum([(i - j) ** 2 for i, j in zip(coord1, coord2)]))


# 坐标点
coordinates = {
    'A': (0, 0),
    'B': (2, 4),
    'C': (5, 1),
    'D': (7, 3)
}

# 构建图
graph = {point: {} for point in coordinates}
for point1 in coordinates:
    for point2 in coordinates:
        if point1 != point2:
            graph[point1][point2] = euclidean_distance(
                coordinates[point1], coordinates[point2])

# 起点、终点
start = 'A'
end = 'D'

# 计算路径
path = shortest_path(graph, start, end)
print("最短路径:", path)
