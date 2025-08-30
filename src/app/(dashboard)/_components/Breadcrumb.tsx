"use client";

import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const pathMap: Record<string, string> = {
  '/': 'Visão Geral',
  '/incidents': 'Incidentes',
  '/dispatch': 'Atendimentos',
  '/units': 'Viaturas',
  '/admin/citizens': 'Cidadãos',
  '/admin/users': 'Usuários Administrativos',
  '/emergency-contacts': 'Contatos de Emergência',
  '/voice/recordings': 'Gravações de Voz',
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Início', href: '/' }
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      let label = pathMap[currentPath] || path.charAt(0).toUpperCase() + path.slice(1);
      
      // Special handling for emergency-contacts with citizenId
      if (currentPath === '/emergency-contacts' && searchParams.get('citizenId')) {
        label = 'Contatos de Emergência do Cidadão';
      }
      
      breadcrumbs.push({
        label,
        href: paths[paths.length - 1] === path ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        if (isLast) {
          return (
            <Typography key={breadcrumb.label} color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              {breadcrumb.label}
            </Typography>
          );
        }

        return (
          <Link
            key={breadcrumb.label}
            underline="hover"
            color="inherit"
            href={breadcrumb.href}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {breadcrumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
