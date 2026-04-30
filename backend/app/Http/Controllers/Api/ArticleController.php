<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sortField = $request->get('sort_field', '');
        $sortOrderRequest = $request->get('sort_order', 'desc');
        $sortOrder = $sortOrderRequest === 'asc' ? 'asc' : 'desc';
        $allowedFields = ['id', 'title'];
        if (!in_array($sortField, $allowedFields)) {
            $sortField = 'created_at';
        }
        
        $articles = Article::orderBy($sortField, $sortOrder)
            ->get()
            ->map(fn($a) => [
                'id'         => $a->id,
                'title'      => $a->title,
                'summary'    => mb_substr($a->content, 0, 200) . (mb_strlen($a->content) > 200 ? '...' : ''),
                'created_at' => $a->created_at->toIso8601String(),
            ]);

        return response()->json($articles);
    }

    public function show(int $id): JsonResponse
    {
        $article = Article::with([
            'comments' => fn($q) => $q->orderBy('created_at'),
        ])->findOrFail($id);

        return response()->json([
            'id'         => $article->id,
            'title'      => $article->title,
            'content'    => $article->content,
            'created_at' => $article->created_at->toIso8601String(),
            'comments'   => $article->comments->map(fn($c) => [
                'id'          => $c->id,
                'author_name' => $c->author_name,
                'content'     => $c->content,
                'created_at'  => $c->created_at->toIso8601String(),
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article = Article::create($data);

        return response()->json([
            'id'         => $article->id,
            'title'      => $article->title,
            'content'    => $article->content,
            'created_at' => $article->created_at->toIso8601String(),
        ], 201);
    }
}
