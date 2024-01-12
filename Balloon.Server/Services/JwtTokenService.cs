using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Balloon.Shared.DataModels;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
namespace Balloon.Server.Services;

public class JwtTokenService
{
    private readonly SymmetricSecurityKey _securityKey;

    public JwtTokenService(IOptions<JwtTokenServiceOptions> jwtTokenServiceOptions)
    {
        _securityKey = new SymmetricSecurityKey(Convert.FromBase64String(jwtTokenServiceOptions.Value.Secret));
    }

    public (string Token, DateTime Expires) CreateToken(UserViewModel userViewModel)
    {
        return CreateToken(userViewModel.Id.ToString(), userViewModel.Username);
    }

    public (string Token, DateTime Expires) CreateToken(string userId, string displayName)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();
        var expires = DateTime.UtcNow.AddSeconds(120);
        var token = jwtTokenHandler.CreateEncodedJwt(new SecurityTokenDescriptor()
        {
            SigningCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, displayName),
                new Claim(ClaimTypes.NameIdentifier, userId),
            }),
            Expires = expires,
        });

        return (token, expires);
    }
}

public class JwtTokenServiceOptions
{
    public string Secret { get; set; }
}