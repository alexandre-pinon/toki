import application/context.{type Context}
import application/use_cases/register_user_use_case
import application/use_cases/update_user_use_case.{UpdateUserUseCasePort}
import gleam/json
import gleam/option.{None, Some}
import gleam/string
import infrastructure/repositories/user_repository
import presentation/rest/decoders
import presentation/rest/encoders
import presentation/rest/middlewares
import wisp.{type Request, type Response}

pub fn list(ctx: Context) -> Response {
  case user_repository.find_all(ctx.pool) {
    Ok(users) ->
      json.array(users, encoders.encode_user)
      |> json.to_string_builder
      |> wisp.json_response(200)
    Error(error) -> {
      wisp.log_error(string.inspect(error))
      wisp.internal_server_error()
    }
  }
}

pub fn show(ctx: Context, id: String) -> Response {
  use user_id <- middlewares.require_uuid(id)

  case user_repository.find_by_id(user_id, ctx.pool) {
    Ok(Some(user)) ->
      encoders.encode_user(user)
      |> json.to_string_builder
      |> wisp.json_response(200)
    Ok(None) -> wisp.not_found()
    Error(error) -> {
      wisp.log_error(string.inspect(error))
      wisp.internal_server_error()
    }
  }
}

pub fn create(req: Request, ctx: Context) -> Response {
  use json <- wisp.require_json(req)

  case decoders.decode_google_register_request(json) {
    Ok(decoded) -> {
      case register_user_use_case.execute(decoded, ctx) {
        Ok(user) ->
          encoders.encode_user(user)
          |> json.to_string_builder
          |> wisp.json_response(201)
        Error(register_user_use_case.EmailAlreadyExists) -> wisp.response(409)
        Error(register_user_use_case.ValidationFailed(_)) ->
          wisp.unprocessable_entity()
        Error(error) -> {
          wisp.log_error(string.inspect(error))
          wisp.internal_server_error()
        }
      }
    }
    Error(error) -> {
      wisp.log_error(string.inspect(error))
      wisp.unprocessable_entity()
    }
  }
}

pub fn update(req: Request, ctx: Context, id: String) -> Response {
  use user_id <- middlewares.require_uuid(id)
  use json <- wisp.require_json(req)

  case decoders.decode_user_update_request(json) {
    Ok(decoded) -> {
      let port = UpdateUserUseCasePort(user_id, decoded)

      case update_user_use_case.execute(port, ctx) {
        Ok(user) ->
          encoders.encode_user(user)
          |> json.to_string_builder
          |> wisp.json_response(200)
        Error(update_user_use_case.UserNotFound) -> wisp.not_found()
        Error(update_user_use_case.EmailAlreadyExists) -> wisp.response(409)
        Error(update_user_use_case.ValidationFailed(_)) ->
          wisp.unprocessable_entity()
        Error(error) -> {
          wisp.log_error(string.inspect(error))
          wisp.internal_server_error()
        }
      }
    }
    Error(error) -> {
      wisp.log_error(string.inspect(error))
      wisp.unprocessable_entity()
    }
  }
}

pub fn delete(ctx: Context, id: String) -> Response {
  use user_id <- middlewares.require_uuid(id)

  case user_repository.delete(user_id, ctx.pool) {
    Ok(True) -> wisp.no_content()
    Ok(False) -> wisp.not_found()
    Error(error) -> {
      wisp.log_error(string.inspect(error))
      wisp.internal_server_error()
    }
  }
}
