FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MovieManagement/MovieManagement.csproj", "MovieManagement/"]
RUN dotnet restore "MovieManagement/MovieManagement.csproj"
COPY . .
WORKDIR "/src/MovieManagement"
RUN dotnet build "MovieManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MovieManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create uploads directory for image storage
RUN mkdir -p wwwroot/uploads

ENTRYPOINT ["dotnet", "MovieManagement.dll"]