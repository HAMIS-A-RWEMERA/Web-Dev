app_name = "kglmart"

app {
  primary_region = "kgl"
  port = 3000

  process {
    name = "kglmart"
  }

  compute {
    cpu = 1
    memory = 256
    cpu_kind = "shared"
  }
}