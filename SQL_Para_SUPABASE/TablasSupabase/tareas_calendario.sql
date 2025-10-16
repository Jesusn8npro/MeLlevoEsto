-- Tabla de calendario/kanban de tareas
-- Ejecuta este script en tu proyecto de Supabase (SQL editor)

create table if not exists public.tareas_calendario (
  id bigint generated always as identity primary key,
  titulo text not null,
  descripcion text,
  tipo text not null default 'otro',
  estado text not null default 'pendiente',
  prioridad text not null default 'media',
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  responsable_id text null,
  etiquetas jsonb not null default '[]'::jsonb,
  dependencias jsonb not null default '[]'::jsonb,
  producto_id text null,
  categoria_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tareas_estado_chk check (estado in ('pendiente','en_progreso','bloqueado','completada')),
  constraint tareas_prioridad_chk check (prioridad in ('alta','media','baja'))
);

-- Índices útiles
create index if not exists tareas_calendario_fecha_inicio_idx on public.tareas_calendario (fecha_inicio);
create index if not exists tareas_calendario_fecha_fin_idx on public.tareas_calendario (fecha_fin);
create index if not exists tareas_calendario_estado_idx on public.tareas_calendario (estado);
create index if not exists tareas_calendario_prioridad_idx on public.tareas_calendario (prioridad);

-- Trigger para updated_at
create or replace function public.actualizar_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tareas_calendario_actualizar_updated_at on public.tareas_calendario;
create trigger tareas_calendario_actualizar_updated_at
before update on public.tareas_calendario
for each row execute function public.actualizar_updated_at();

-- Políticas RLS: permitir a usuarios autenticados CRUD completo
alter table public.tareas_calendario enable row level security;

-- Nota: CREATE POLICY no soporta IF NOT EXISTS. Usar DROP IF EXISTS + CREATE.
drop policy if exists tareas_select_authenticated on public.tareas_calendario;
create policy tareas_select_authenticated
  on public.tareas_calendario for select
  to authenticated
  using (true);

drop policy if exists tareas_insert_authenticated on public.tareas_calendario;
create policy tareas_insert_authenticated
  on public.tareas_calendario for insert
  to authenticated
  with check (true);

drop policy if exists tareas_update_authenticated on public.tareas_calendario;
create policy tareas_update_authenticated
  on public.tareas_calendario for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists tareas_delete_authenticated on public.tareas_calendario;
create policy tareas_delete_authenticated
  on public.tareas_calendario for delete
  to authenticated
  using (true);

-- Nota: si deseas aislar por usuario, añade una columna usuario_id y cambia
-- las políticas a "using (auth.uid() = usuario_id)" y "with check (auth.uid() = usuario_id)".