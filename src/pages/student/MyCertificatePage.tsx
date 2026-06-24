import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { useMyCertificate } from '../../hooks/useCertificates';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatDate } from '../../utils/helpers';

export default function MyCertificatePage() {
  const { data: certificate, isLoading } = useMyCertificate();

  if (isLoading) return <div>Loading certificate...</div>;

  const token = certificate?.token || certificate?.certificateToken;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="My Certificate" description="View and verify your issued clearance certificate." />

      <Card>
        <CardContent className="p-6">
          {!certificate ? (
            <div className="text-center py-8 text-muted-foreground">
              No certificate has been issued yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Clearance Certificate</h3>
                  <p className="text-sm text-muted-foreground">
                    Issued {certificate.issuedAt ? formatDate(certificate.issuedAt) : 'recently'}
                  </p>
                </div>
              </div>

              {token && (
                <div className="rounded-md border bg-muted/40 p-3 text-sm">
                  <span className="font-medium">Verification token:</span> {token}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {certificate.fileUrl && (
                  <Button asChild>
                    <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open certificate
                    </a>
                  </Button>
                )}
                {token && (
                  <Button variant="outline" asChild>
                    <a href={`/verify-certificate?token=${encodeURIComponent(token)}`}>
                      Verify publicly
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
