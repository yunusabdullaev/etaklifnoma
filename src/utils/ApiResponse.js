/**
 * Standard API response helpers.
 */
class ApiResponse {
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static created(res, data) {
    return ApiResponse.success(res, data, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static paginated(res, { rows, count, page, limit }) {
    return res.status(200).json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  }
}

module.exports = ApiResponse;
