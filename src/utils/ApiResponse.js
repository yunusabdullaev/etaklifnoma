/**
 * Standard API response helpers.
 */
class ApiResponse {
  static success(res, data, message = 'OK', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = 'Created') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
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

  static error(res, { message = 'Error' }, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: { message },
    });
  }
}

module.exports = ApiResponse;
