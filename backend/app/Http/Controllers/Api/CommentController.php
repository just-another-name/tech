<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, int $articleId): JsonResponse
    {
        Article::findOrFail($articleId);

        $data = $request->validate([
            'author_name' => 'required|string|max:100',
            'text'        => 'required|string',
        ]);

        $comment = Comment::create([
            'article_id'  => $articleId,
            'author_name' => $data['author_name'],
            'content'     => $data['content'],
        ]);

        return response()->json([
            'id'          => $comment->id,
            'article_id'  => $comment->article_id,
            'author_name' => $comment->author_name,
            'content'     => $comment->content,
            'created_at'  => $comment->created_at->toIso8601String(),
        ], 201);
    }
}
