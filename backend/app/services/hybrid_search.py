def reciprocal_rank_fusion(keyword_ids: list[str], semantic_ids: list[str], k: int = 60):
    scores = {}
    for ranking in (keyword_ids, semantic_ids):
        for rank, item_id in enumerate(ranking, 1):
            scores[item_id] = scores.get(item_id, 0) + 1 / (k + rank)
    return [x for x,_ in sorted(scores.items(), key=lambda p:p[1], reverse=True)]
